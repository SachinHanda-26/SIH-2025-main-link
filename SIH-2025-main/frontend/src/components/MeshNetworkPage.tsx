import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Brain, Radio, Bluetooth, Wifi, MapPin, Zap } from "lucide-react";
import "../styles/blockAndMesh.css"; // <-- Add this line to import the CSS

interface Tourist {
  id: number;
  name: string;
  x: number;
  y: number;
  connected: boolean;
  isAuthority?: boolean;
}

interface Connection {
  from: number;
  to: number;
  active: boolean;
  type: "walkie" | "bluetooth" | "ai";
}

type CommunicationMode = "ai" | "walkie" | "bluetooth";

interface MeshNetworkPageProps {
  onBack: () => void;
}

export function MeshNetworkPage({ onBack }: MeshNetworkPageProps) {
  const [communicationMode, setCommunicationMode] =
    useState<CommunicationMode>("ai");
  const [tourists] = useState<Tourist[]>([
    { id: 1, name: "Alice", x: 150, y: 200, connected: true },
    { id: 2, name: "Bob", x: 300, y: 150, connected: true },
    { id: 3, name: "Charlie", x: 450, y: 250, connected: false },
    { id: 4, name: "Diana", x: 200, y: 300, connected: false },
    { id: 5, name: "Eve", x: 370, y: 340, connected: false },
    {
      id: 6,
      name: "Authority",
      x: 550,
      y: 180,
      connected: true,
      isAuthority: true,
    },
  ]);

  const [activeConnections, setActiveConnections] = useState<Connection[]>([]);
  const [animatingPath, setAnimatingPath] = useState<number[]>([]);

  const getConnectionsForMode = (mode: CommunicationMode): Connection[] => {
    switch (mode) {
      case "ai":
        return [
          { from: 1, to: 6, active: true, type: "ai" },
          { from: 2, to: 6, active: true, type: "ai" },
        ];
      case "walkie":
        return [
          { from: 1, to: 2, active: true, type: "walkie" },
          { from: 3, to: 4, active: true, type: "walkie" },
        ];
      case "bluetooth":
        return [
          { from: 1, to: 2, active: true, type: "bluetooth" },
          { from: 2, to: 3, active: true, type: "bluetooth" },
          { from: 3, to: 6, active: true, type: "bluetooth" },
          { from: 4, to: 5, active: true, type: "bluetooth" },
          { from: 5, to: 6, active: true, type: "bluetooth" },
        ];
      default:
        return [];
    }
  };

  const animateDataTransfer = () => {
    if (communicationMode === "bluetooth") {
      // Animate a message path from tourist 1 to authority (6)
      const path = [1, 2, 3, 6];
      setAnimatingPath([]);

      path.forEach((nodeId, index) => {
        setTimeout(() => {
          setAnimatingPath((prev) => [...prev, nodeId]);
        }, index * 800);
      });

      setTimeout(() => {
        setAnimatingPath([]);
      }, path.length * 800 + 1000);
    }
  };

  useEffect(() => {
    setActiveConnections(getConnectionsForMode(communicationMode));
  }, [communicationMode]);

  const getTouristById = (id: number) => tourists.find((t) => t.id === id);

  const getConnectionColor = (type: string) => {
    switch (type) {
      case "ai":
        return "#3b82f6";
      case "walkie":
        return "#22c55e";
      case "bluetooth":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const getSignalIcon = (mode: CommunicationMode) => {
    switch (mode) {
      case "ai":
        return Brain;
      case "walkie":
        return Radio;
      case "bluetooth":
        return Bluetooth;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <Button onClick={onBack} className="mb-4">
        Back
      </Button>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-5xl text-gray-800 mb-6 flex items-center justify-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl text-white shadow-lg">
              <Wifi className="w-8 h-8" />
            </div>
            Reliable Communication in No-Network Zones
          </motion.h1>
          <motion.p
            className="text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore how tourists communicate when cellular networks are
            unavailable using
            <span className="text-blue-600 font-semibold">
              {" "}
              AI-assisted packet prediction
            </span>
            ,
            <span className="text-green-600 font-semibold">
              {" "}
              direct walkie-talkie signals
            </span>
            , and
            <span className="text-purple-600 font-semibold">
              {" "}
              multi-hop mesh networks
            </span>
            .
          </motion.p>
        </div>

        {/* Communication Mode Selector */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            {
              mode: "ai" as const,
              label: "AI Prediction",
              icon: Brain,
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              mode: "walkie" as const,
              label: "Walkie-Talkie",
              icon: Radio,
              gradient: "from-green-500 to-emerald-500",
            },
            {
              mode: "bluetooth" as const,
              label: "Bluetooth Mesh",
              icon: Bluetooth,
              gradient: "from-purple-500 to-indigo-500",
            },
          ].map(({ mode, label, icon: Icon, gradient }) => (
            <Button
              key={mode}
              onClick={() => setCommunicationMode(mode)}
              className={`flex items-center gap-2 rounded-full px-8 py-4 transition-all duration-300 hover:scale-105 ${
                communicationMode === mode
                  ? `bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl`
                  : "bg-white border-gray-300 text-gray-600 hover:border-gray-400 shadow-md"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Network Visualization */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-white border-gray-200 rounded-2xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                  Network Topology - {communicationMode.toUpperCase()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden border border-gray-100">
                  <svg width="100%" height="100%" className="absolute inset-0">
                    {/* Render connections */}
                    {activeConnections.map((connection, index) => {
                      const fromTourist = getTouristById(connection.from);
                      const toTourist = getTouristById(connection.to);

                      if (!fromTourist || !toTourist) return null;

                      return (
                        <motion.line
                          key={`${connection.from}-${connection.to}`}
                          x1={fromTourist.x}
                          y1={fromTourist.y}
                          x2={toTourist.x}
                          y2={toTourist.y}
                          stroke={getConnectionColor(connection.type)}
                          strokeWidth="2"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.7 }}
                          transition={{ duration: 0.8, delay: index * 0.2 }}
                        />
                      );
                    })}
                  </svg>

                  {/* Render tourists */}
                  <AnimatePresence>
                    {tourists.map((tourist) => {
                      const isAnimating = animatingPath.includes(tourist.id);
                      const SignalIcon = getSignalIcon(communicationMode);

                      return (
                        <motion.div
                          key={tourist.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2"
                          style={{ left: tourist.x, top: tourist.y }}
                          initial={{ scale: 0 }}
                          animate={{
                            scale: isAnimating ? 1.3 : 1,
                            boxShadow: isAnimating
                              ? `0 0 20px ${getConnectionColor(
                                  communicationMode
                                )}`
                              : "none",
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div
                            className={`
                            w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-300
                            ${
                              tourist.isAuthority
                                ? "bg-gradient-to-r from-red-500 to-pink-500 border-red-300"
                                : tourist.connected
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-300"
                                : "bg-gradient-to-r from-gray-400 to-slate-400 border-gray-300"
                            }
                          `}
                          >
                            {tourist.isAuthority ? (
                              <Wifi className="w-6 h-6 text-white" />
                            ) : (
                              <SignalIcon className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="text-gray-700 text-sm text-center mt-2 whitespace-nowrap font-medium">
                            {tourist.name}
                          </div>

                          {isAnimating && (
                            <motion.div
                              className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: [0, 1.5, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Animate Data Transfer Button for Bluetooth */}
                  {communicationMode === "bluetooth" && (
                    <motion.div
                      className="absolute bottom-4 right-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Button
                        onClick={animateDataTransfer}
                        size="sm"
                        className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-yellow-200 transition-all duration-300 hover:scale-105"
                      >
                        <Zap className="w-4 h-4" />
                        Send Message
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Information Panel */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Current Mode Info */}
            <Card
              className={`border-2 rounded-2xl shadow-xl transition-all duration-300 ${
                communicationMode === "ai"
                  ? "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
                  : communicationMode === "walkie"
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                  : "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl text-white ${
                      communicationMode === "ai"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                        : communicationMode === "walkie"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-purple-500 to-indigo-500"
                    }`}
                  >
                    {communicationMode === "ai" && (
                      <Brain className="w-5 h-5" />
                    )}
                    {communicationMode === "walkie" && (
                      <Radio className="w-5 h-5" />
                    )}
                    {communicationMode === "bluetooth" && (
                      <Bluetooth className="w-5 h-5" />
                    )}
                  </div>
                  {communicationMode === "ai" && "AI Prediction"}
                  {communicationMode === "walkie" &&
                    "Walkie-Talkie Communication"}
                  {communicationMode === "bluetooth" &&
                    "Bluetooth Mesh Network"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {communicationMode === "ai" && (
                  <>
                    <p className="text-gray-600 leading-relaxed">
                      Before entering a no-network area, AI predicts and
                      pre-sends data packets to authorities.
                    </p>
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 rounded-full px-4 py-1">
                      Predictive Communication
                    </Badge>
                  </>
                )}

                {communicationMode === "walkie" && (
                  <>
                    <p className="text-gray-600 leading-relaxed">
                      Direct peer-to-peer communication between tourists within
                      signal range.
                    </p>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 rounded-full px-4 py-1">
                      Direct Signal • ~5km range
                    </Badge>
                  </>
                )}

                {communicationMode === "bluetooth" && (
                  <>
                    <p className="text-gray-600 leading-relaxed">
                      Messages hop from one tourist to another until reaching an
                      internet-connected node.
                    </p>
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 rounded-full px-4 py-1">
                      Multi-hop Network • ~50m per hop
                    </Badge>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-white border-gray-200 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl text-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                  Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-sm"></div>
                  <span className="text-gray-600">Connected Tourist</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-slate-400 rounded-full shadow-sm"></div>
                  <span className="text-gray-600">Disconnected Tourist</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-sm"></div>
                  <span className="text-gray-600">Authority/Gateway</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-sm"></div>
                  <span className="text-gray-600">Active Connection</span>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl text-white">
                    <Wifi className="w-5 h-5" />
                  </div>
                  Network Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                  <span className="text-gray-600">Active Nodes:</span>
                  <span className="text-gray-800 font-semibold">
                    {tourists.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                  <span className="text-gray-600">Connected:</span>
                  <span className="text-gray-800 font-semibold">
                    {tourists.filter((t) => t.connected).length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                  <span className="text-gray-600">Active Links:</span>
                  <span className="text-gray-800 font-semibold">
                    {activeConnections.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
