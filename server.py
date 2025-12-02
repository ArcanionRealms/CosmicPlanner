#!/usr/bin/env python3
"""
Cosmic Planner Desktop Server
A simple HTTP server for running the Cosmic Planner app locally
"""

import http.server
import socketserver
import webbrowser
import threading
import time
import os
from pathlib import Path

class CosmicHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def start_server(port=8000):
    """Start the HTTP server"""
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer(("", port), CosmicHTTPRequestHandler) as httpd:
        print(f"🚀 Cosmic Planner server starting on port {port}")
        print(f"🌌 Open http://localhost:{port} in your browser")
        print("🛑 Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Shutting down Cosmic Planner server...")
            httpd.shutdown()

def open_browser(port=8000):
    """Open the browser after a short delay"""
    time.sleep(1.5)
    webbrowser.open(f'http://localhost:{port}')

def main():
    """Main function to start the app"""
    print("🌌 Welcome to Cosmic Planner!")
    print("================================")
    
    port = 8000
    
    # Start browser in a separate thread
    browser_thread = threading.Thread(target=open_browser, args=(port,))
    browser_thread.daemon = True
    browser_thread.start()
    
    # Start server
    start_server(port)

if __name__ == "__main__":
    main()