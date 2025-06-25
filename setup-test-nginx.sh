#!/bin/bash

# Test script to create a temporary nginx config directory for testing
# This helps users test the nginx functionality without affecting their actual nginx installation

TEST_DIR="$HOME/.boojoog-test-nginx"

echo "Setting up test nginx configuration directory..."

# Create test directory
mkdir -p "$TEST_DIR"

# Create some sample nginx configuration files
cat > "$TEST_DIR/test-app.conf" << 'EOF'
server {
    listen 80;
    server_name test-app.local;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

cat > "$TEST_DIR/api-server.conf" << 'EOF'
upstream api_backend {
    server localhost:8000;
    server localhost:8001 backup;
}

server {
    listen 80;
    server_name api.local;
    
    location / {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

cat > "$TEST_DIR/static-site.conf" << 'EOF'
server {
    listen 80;
    server_name static.local;
    root /var/www/static;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location ~* \.(css|js|img|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo "Test nginx configuration directory created at: $TEST_DIR"
echo ""
echo "Sample configurations created:"
echo "- test-app.conf (Basic proxy to localhost:3000)"
echo "- api-server.conf (Load balancer with upstream)"
echo "- static-site.conf (Static file server)"
echo ""
echo "To use this directory in Boojoog Hosts Manager:"
echo "1. Open the app and go to the Nginx page"
echo "2. Click Settings"
echo "3. Set the configuration directory path to: $TEST_DIR"
echo "4. Click Save"
echo ""
echo "You can now manage these configurations and create new ones through the app!"
echo ""
echo "To clean up later, run: rm -rf $TEST_DIR"
