const clamOptions = {
  removeInfected: false, // Do not remove files if they are infected
  quarantineInfected: false, // Do not move infected files to a quarantine directory
  debugMode: true, // Enable debug mode to see detailed output in the console
  scanRecursively: false, // Disable recursive scanning to save CPU cycles
  clamdscan: {
    // Since your Docker setup exposes clamav on port 3310, we'll configure accordingly
    host: "localhost", // Use the service name defined in docker-compose as the hostname
    port: 3310, // This should match the port exposed in your docker-compose file
    timeout: 300000, // Set a timeout for scanning operations (5 minutes)
    configFile: "/etc/clamav/clamd.conf", // Adjust path as necessary for your setup
    multiscan: false, // Disable multiscan if you prefer to scan files one at a time
    reloadDb: false, // Set to false for better performance, as db reloading is handled by freshclam
    active: true, // Make sure clamdscan is set as active to use it for scanning
  },
  preference: "clamdscan", // Prefer clamdscan over clamscan for scanning operations
};

const clamDevOptions = {
  removeInfected: false,
  quarantineInfected: false, // Don't quarantine infected files in dev
  scanRecursively: true,
  clamdscan: {
    socket: false, // Not using a UNIX socket for dev
    host: "localhost", // Use localhost to connect to the Docker-mapped port
    port: 3310, // Port mapped in docker-compose
    timeout: 60000, // Adjust based on your needs
    active: true,
  },
  preference: "clamdscan",
};

export { clamOptions, clamDevOptions };
