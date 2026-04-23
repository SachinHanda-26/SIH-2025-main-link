# SafarSathi Walkie-Talkie Feature Testing Guide

## Overview

The walkie-talkie feature in SafarSathi enables peer-to-peer text messaging between tourists on the same local network, without requiring internet connectivity. This guide provides instructions for testing this feature in a local network environment.

## Prerequisites

- Node.js and npm installed
- MongoDB running locally
- Two or more devices connected to the same Wi-Fi network/hotspot
- SafarSathi backend and frontend running

## Setup Instructions

### 1. Start the Backend Server

```bash
cd backend
npm install
npm start
```

The backend server should start on port 5002.

### 2. Start the Frontend Application

```bash
cd frontend
npm install
npm start
```

The frontend application should start on port 3001.

### 3. Access the Application

On each test device:
1. Open a browser and navigate to `http://<server-ip>:3001`
2. Log in with test credentials
3. Navigate to the Walkie-Talkie feature by clicking the "Walkie" tab in the bottom navigation

## Testing Scenarios

### Basic Connectivity Test

1. Connect two or more devices to the same Wi-Fi network
2. Open the SafarSathi app on each device and navigate to the Walkie-Talkie feature
3. Verify that each device can discover other devices on the network
4. Send a test message from one device and verify it's received by other devices

### Channel Management Test

1. Create a new channel on one device
2. Verify the channel appears in the channel list on other devices
3. Join the channel from another device
4. Send messages within the channel and verify they're received by all channel members

### Emergency Message Test

1. Send an emergency message from one device
2. Verify it appears with high priority on other devices
3. Verify it's also visible in the Authority Dashboard under the Emergency Communications tab

### Range Test

1. Position devices at different distances within the Wi-Fi range
2. Send messages and verify reception at various distances
3. Note the maximum effective range for reliable communication

### Offline Operation Test

1. Disconnect all devices from the internet (but maintain local Wi-Fi connection)
2. Verify that walkie-talkie messaging continues to function
3. Reconnect to the internet and verify that any emergency messages are synced to the server

## Troubleshooting

### Connection Issues

- Ensure all devices are connected to the same Wi-Fi network
- Check that the backend server is running and accessible
- Verify that WebSocket connections are not blocked by firewalls

### Message Delivery Problems

- Check the console for any WebSocket connection errors
- Verify that the user's location is properly set
- Ensure the device has granted necessary permissions

## Performance Metrics

During testing, observe and document the following metrics:

- Message delivery time (should be near-instantaneous)
- Maximum number of concurrent users before performance degradation
- Battery consumption during extended use
- Reliability of message delivery at different distances

## Security Considerations

- All messages are encrypted during transmission
- Emergency messages are authenticated before being stored on the server
- User location data is only shared with explicit permission

## Next Steps

After successful testing, consider the following improvements:

1. Implement voice messaging capability
2. Add support for image sharing in emergency situations
3. Enhance the range through mesh networking capabilities
4. Implement automatic language translation for international tourists