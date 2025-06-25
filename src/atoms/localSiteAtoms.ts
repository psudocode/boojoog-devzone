import { atom } from "jotai";
import {
  updateHostsEntries,
  getHostsEntries,
} from "../helpers/ipcHandler";
import { HostEntry } from "../../electron/app/hosts/hosts";
import { 
  nginxPathConfiguredAtom,
  loadAppSettingsAtom,
  createNginxConfigAtom,
  removeNginxConfigAtom,
  settingsErrorAtom,
  boojoogNginxConfigsAtom,
  fetchBoojoogNginxConfigsAtom
} from "./consolidatedAtoms";

export interface LocalSite {
  id: string;
  domain: string;
  localAddress: string;
  comment: string;
  createdAt: Date;
  hostsEntryExists: boolean;
  nginxConfigExists: boolean;
}

export interface CreateLocalSiteData {
  domain: string;
  localAddress: string;
  comment: string;
}

// Atom for storing hosts entries (for deriving local sites)
const hostsEntriesAtom = atom<HostEntry[]>([]);

// Derived atom that reads local sites from hosts file and nginx configs
export const localSitesAtom = atom<LocalSite[]>((get) => {
  const hostsEntries = get(hostsEntriesAtom);
  const nginxConfigs = get(boojoogNginxConfigsAtom);
  
  // Filter hosts entries that look like local development sites (127.0.0.1)
  const localHostsEntries = hostsEntries.filter(entry => 
    entry.ip === "127.0.0.1" && 
    entry.hostname && 
    entry.hostname !== "localhost"
  );

  const localSites: LocalSite[] = [];
  const processedDomains = new Set<string>();

  // 1. Create local sites based on hosts entries (Nginx + HostEntry OR HostEntry only)
  localHostsEntries.forEach(entry => {
    // Check if there's a corresponding nginx config
    const nginxConfigName = `${entry.hostname.replace(/\./g, '_')}.conf`;
    const nginxConfig = nginxConfigs.find(config => config.filename === nginxConfigName);
    
    // Try to extract local address from nginx config
    let localAddress = ""; // default
    if (nginxConfig && nginxConfig.content) {
      const proxyPassMatch = nginxConfig.content.match(/proxy_pass\s+http:\/\/([^;]+)/);
      if (proxyPassMatch) {
        localAddress = proxyPassMatch[1];
      }
    }

    const localSite: LocalSite = {
      id: `localsite_${entry.hostname}_${entry.lineNumber}`,
      domain: entry.hostname,
      localAddress,
      comment: entry.comment || "",
      createdAt: new Date(), // We can't know the actual creation date
      hostsEntryExists: true,
      nginxConfigExists: !!nginxConfig,
    };

    localSites.push(localSite);
    processedDomains.add(entry.hostname);
  });

  // 2. Create local sites based on nginx configs that don't have hosts entries (Nginx only)
  nginxConfigs.forEach(nginxConfig => {
    // Extract domain from nginx config filename (convert underscores back to dots)
    const domain = nginxConfig.filename.replace(/\.conf$/, '').replace(/_/g, '.');
    
    // Skip if this domain already has a hosts entry
    if (processedDomains.has(domain)) {
      return;
    }

    // Try to extract local address from nginx config content
    let localAddress = "";
    if (nginxConfig.content) {
      const proxyPassMatch = nginxConfig.content.match(/proxy_pass\s+http:\/\/([^;]+)/);
      if (proxyPassMatch) {
        localAddress = proxyPassMatch[1];
      }
    }

    // Extract comment from nginx config if available
    let comment = "";
    if (nginxConfig.content) {
      const commentMatch = nginxConfig.content.match(/# (.+)/);
      if (commentMatch) {
        comment = commentMatch[1];
      }
    }

    const localSite: LocalSite = {
      id: `localsite_nginx_${domain}_${nginxConfig.filename}`,
      domain,
      localAddress,
      comment: comment || `Nginx only - ${domain}`,
      createdAt: new Date(), // We can't know the actual creation date
      hostsEntryExists: false,
      nginxConfigExists: true,
    };

    localSites.push(localSite);
  });

  return localSites;
});

// Action to refresh local sites data
export const refreshLocalSitesAtom = atom(
  null,
  async (_, set) => {
    try {
      set(localSiteLoadingAtom, true);
      set(localSiteErrorAtom, null);

      // Fetch current hosts entries
      const hostsResponse = await getHostsEntries();
      const hostsBlock = hostsResponse.hostsBlock?.[0];
      
      if (hostsBlock) {
        set(hostsEntriesAtom, hostsBlock.entries);
      }

      // Refresh nginx configs
      await set(fetchBoojoogNginxConfigsAtom);
      
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Failed to refresh local sites");
      set(localSiteErrorAtom, errorObj);
    } finally {
      set(localSiteLoadingAtom, false);
    }
  }
);

// Atom for loading state
export const localSiteLoadingAtom = atom<boolean>(false);

// Atom for error state
export const localSiteErrorAtom = atom<Error | null>(null);

// Action atoms for operations

// Create a new local site (hosts entry + nginx config)
export const createLocalSiteAtom = atom(
  null,
  async (get, set, data: CreateLocalSiteData) => {
    try {
      set(localSiteLoadingAtom, true);
      set(localSiteErrorAtom, null);

      const { domain, localAddress, comment } = data;

      // Validate nginx path is configured
      const nginxConfigured = get(nginxPathConfiguredAtom);
      if (!nginxConfigured) {
        throw new Error("Nginx configuration path is not set. Please configure it in the Nginx page settings.");
      }

      // 1. Create hosts file entry
      const hostsResponse = await getHostsEntries();
      const hostsBlock = hostsResponse.hostsBlock?.[0];
      
      if (!hostsBlock) {
        throw new Error("Failed to access hosts file");
      }

      // Check if domain already exists in hosts
      const existingHostEntry = hostsBlock.entries.find(
        entry => entry.ip === "127.0.0.1" && entry.hostname === domain
      );

      const updatedEntries = [...hostsBlock.entries];

      if (!existingHostEntry) {
        // Add new hosts entry
        const newHostEntry: HostEntry = {
          ip: "127.0.0.1",
          hostname: domain,
          comment: comment || `Local site - ${domain}`,
          lineNumber: Math.max(...hostsBlock.entries.map(e => e.lineNumber), 0) + 1,
        };
        updatedEntries.push(newHostEntry);

        // Update hosts file
        await updateHostsEntries({
          entries: updatedEntries,
          rawBefore: hostsBlock.rawBefore,
          rawAfter: hostsBlock.rawAfter,
        });
      }

      // 2. Create nginx configuration using consolidated atom
      const nginxConfigContent = `server {
    listen 80;
    server_name ${domain};
    
    location / {
        proxy_pass http://${localAddress};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support for development
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}`;

      const configFilename = `${domain.replace(/\./g, '_')}.conf`;
      await set(createNginxConfigAtom, { filename: configFilename, content: nginxConfigContent });

      // Refresh local sites data to reflect the new site
      await set(refreshLocalSitesAtom);

      // Create local site object for return (derived from the newly created data)
      const newLocalSite: LocalSite = {
        id: `localsite_${domain}_${Date.now()}`,
        domain,
        localAddress,
        comment,
        createdAt: new Date(),
        hostsEntryExists: true,
        nginxConfigExists: true,
      };

      return newLocalSite;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Failed to create local site");
      set(localSiteErrorAtom, errorObj);
      throw errorObj;
    } finally {
      set(localSiteLoadingAtom, false);
    }
  }
);

// Check nginx configuration path status
export const checkNginxPathAtom = atom(
  null,
  async (get, set) => {
    try {
      // Check if there are any settings loading errors
      const settingsError = get(settingsErrorAtom);
      if (settingsError) {
        set(localSiteErrorAtom, new Error(`Settings error: ${settingsError.message}`));
        return;
      }

      // Load nginx settings which will update nginxSettingsAtom
      // and consequently nginxPathConfiguredAtom will be updated automatically
      await set(loadAppSettingsAtom);
      
      // Refresh local sites data to reflect current state
      await set(refreshLocalSitesAtom);
      
      // Clear any previous local site errors if settings load successfully
      set(localSiteErrorAtom, null);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Failed to check nginx path");
      set(localSiteErrorAtom, errorObj);
      console.error("Failed to check nginx path:", error);
    }
  }
);

// Clear local site error
export const clearLocalSiteErrorAtom = atom(
  null,
  (_, set) => {
    set(localSiteErrorAtom, null);
  }
);

// Remove a local site (removes hosts entry and nginx config)
export const removeLocalSiteAtom = atom(
  null,
  async (get, set, siteId: string) => {
    try {
      set(localSiteLoadingAtom, true);
      set(localSiteErrorAtom, null);

      // Find the site to remove
      const localSites = get(localSitesAtom);
      const siteToRemove = localSites.find(site => site.id === siteId);
      
      if (!siteToRemove) {
        throw new Error("Local site not found");
      }

      // 1. Remove from hosts file
      try {
        const hostsResponse = await getHostsEntries();
        const hostsBlock = hostsResponse.hostsBlock?.[0];
        
        if (hostsBlock) {
          // Filter out the hosts entry for this domain
          const updatedEntries = hostsBlock.entries.filter(
            entry => !(entry.ip === "127.0.0.1" && entry.hostname === siteToRemove.domain)
          );

          if (updatedEntries.length !== hostsBlock.entries.length) {
            // Update hosts file if we found and removed entries
            await updateHostsEntries({
              entries: updatedEntries,
              rawBefore: hostsBlock.rawBefore,
              rawAfter: hostsBlock.rawAfter,
            });
          }
        }
      } catch (hostsError) {
        console.warn("Failed to remove hosts entry:", hostsError);
        // Continue with nginx removal even if hosts removal fails
      }

      // 2. Remove nginx configuration using consolidated atom
      try {
        const configFilename = `${siteToRemove.domain.replace(/\./g, '_')}.conf`;
        await set(removeNginxConfigAtom, configFilename);
      } catch (nginxError) {
        console.warn("Failed to remove nginx config:", nginxError);
        // Continue with local site removal even if nginx removal fails
      }

      // 3. Refresh local sites data to reflect the removal
      await set(refreshLocalSitesAtom);

    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Failed to remove local site");
      set(localSiteErrorAtom, errorObj);
      throw errorObj;
    } finally {
      set(localSiteLoadingAtom, false);
    }
  }
);

// Validate domain format
export const validateDomainAtom = atom(
  null,
  (_, __, domain: string): boolean => {
    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain) && domain.length <= 253;
  }
);

// Validate local address format
export const validateLocalAddressAtom = atom(
  null,
  (_, __, address: string): boolean => {
    // Check if it's a valid localhost:port format
    const localhostRegex = /^localhost:\d{1,5}$/;
    const ipRegex = /^127\.0\.0\.1:\d{1,5}$/;
    const portRangeRegex = /:\d{1,5}$/;
    
    if (!localhostRegex.test(address) && !ipRegex.test(address)) {
      return false;
    }
    
    // Check port range
    const portMatch = address.match(portRangeRegex);
    if (portMatch) {
      const port = parseInt(portMatch[0].substring(1));
      return port >= 1 && port <= 65535;
    }
    
    return false;
  }
);
