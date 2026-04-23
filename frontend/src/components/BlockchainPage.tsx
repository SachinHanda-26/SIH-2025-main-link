import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box } from "@react-three/drei";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shield, Hash, Link, AlertTriangle, Plus, Blocks } from "lucide-react";
import type { Mesh } from "three";
import "../styles/blockAndMesh.css"; // <-- Add this line to import the CSS

interface BlockData {
  id: number;
  touristName: string;
  country: string;
  photoHash: string;
  hash: string;
  previousHash: string;
  timestamp: string;
}

interface BlockProps {
  blockData: BlockData;
  position: [number, number, number];
  onClick: () => void;
  isHighlighted?: boolean;
  isTampered?: boolean;
}

function Block({
  blockData,
  position,
  onClick,
  isHighlighted = false,
  isTampered = false,
}: BlockProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      if (isHighlighted) {
        meshRef.current.position.y =
          position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      }
    }
  });

  const blockColor = isTampered
    ? "#ef4444"
    : isHighlighted
    ? "#f97316"
    : hovered
    ? "#8b5cf6"
    : "#6366f1";

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[2, 2, 2]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={blockColor} />
      </Box>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        Block #{blockData.id}
      </Text>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {blockData.touristName}
      </Text>
      {/* Chain connection */}
      {blockData.id > 0 && (
        <Box position={[-1.5, 0, 0]} args={[1, 0.1, 0.1]}>
          <meshStandardMaterial color={isTampered ? "#ef4444" : "#22c55e"} />
        </Box>
      )}
    </group>
  );
}

function Scene({
  blocks,
  onBlockClick,
  highlightedBlock,
  showTampering,
}: {
  blocks: BlockData[];
  onBlockClick: (block: BlockData) => void;
  highlightedBlock: number | null;
  showTampering: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      {blocks.map((block, index) => (
        <Block
          key={block.id}
          blockData={block}
          position={[index * 3 - (blocks.length - 1) * 1.5, 0, 0]}
          onClick={() => onBlockClick(block)}
          isHighlighted={highlightedBlock === block.id}
          isTampered={showTampering && block.id === 2}
        />
      ))}
    </>
  );
}

interface BlockchainPageProps {
  onBack: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function BlockchainPage({
  onBack,
}: // theme,
// onToggleTheme,
BlockchainPageProps) {
  const [blocks, setBlocks] = useState<BlockData[]>([
    {
      id: 0,
      touristName: "Alice Johnson",
      country: "USA",
      photoHash: "a1b2c3d4e5f6",
      hash: "000abc123def456",
      previousHash: "0",
      timestamp: "2024-01-15 10:30:00",
    },
    {
      id: 1,
      touristName: "Bob Chen",
      country: "Canada",
      photoHash: "f6e5d4c3b2a1",
      hash: "000def456abc123",
      previousHash: "000abc123def456",
      timestamp: "2024-01-15 11:15:00",
    },
    {
      id: 2,
      touristName: "Maria Garcia",
      country: "Spain",
      photoHash: "123abc456def",
      hash: "000789ghi012jkl",
      previousHash: "000def456abc123",
      timestamp: "2024-01-15 12:00:00",
    },
  ]);

  const [selectedBlock, setSelectedBlock] = useState<BlockData | null>(null);
  const [highlightedBlock, setHighlightedBlock] = useState<number | null>(null);
  const [showTampering, setShowTampering] = useState(false);

  const addNewBlock = () => {
    const newBlock: BlockData = {
      id: blocks.length,
      touristName: `Tourist ${blocks.length + 1}`,
      country: "France",
      photoHash: `${Math.random().toString(36).substring(7)}`,
      hash: `000${Math.random().toString(36).substring(2, 15)}`,
      previousHash: blocks[blocks.length - 1].hash,
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    setBlocks([...blocks, newBlock]);
    setHighlightedBlock(newBlock.id);
    setTimeout(() => setHighlightedBlock(null), 2000);
  };

  const toggleTampering = () => {
    setShowTampering(!showTampering);
  };

  return (
    <div className="min-h-screen p-6">
      <Button onClick={onBack}>Back</Button> {/* Add back button */}
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
            <div className="p-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl text-white shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            Secure Tourist Data with Blockchain
          </motion.h1>
          <motion.p
            className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Each block securely stores tourist data with cryptographic hashes
            ensuring
            <span className="text-orange-600 font-semibold">
              {" "}
              immutable data
            </span>{" "}
            and
            <span className="text-purple-600 font-semibold">
              {" "}
              hash integrity
            </span>
            .
          </motion.p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            onClick={addNewBlock}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-green-200 transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add New Block
          </Button>
          <Button
            variant="outline"
            onClick={toggleTampering}
            className={`flex items-center gap-2 rounded-full px-8 py-3 transition-all duration-300 hover:scale-105 ${
              showTampering
                ? "bg-red-500 text-white border-red-500 shadow-lg hover:shadow-red-200"
                : "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            {showTampering ? "Hide" : "Show"} Tampering
          </Button>
        </div>

        {/* 3D Visualization */}
        <motion.div
          className="h-96 bg-white rounded-3xl mb-12 overflow-hidden shadow-2xl border border-gray-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <Scene
              blocks={blocks}
              onBlockClick={setSelectedBlock}
              highlightedBlock={highlightedBlock}
              showTampering={showTampering}
            />
          </Canvas>
        </motion.div>

        {/* Information Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl text-white">
                  <Hash className="w-5 h-5" />
                </div>
                Data Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Hash ensures data integrity and prevents unauthorized
                modifications.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white">
                  <Link className="w-5 h-5" />
                </div>
                Immutable Chain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Blocks are linked to form an immutable chain that cannot be
                altered retroactively.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
                  <Shield className="w-5 h-5" />
                </div>
                Secure Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Each block securely stores tourist data with cryptographic
                protection.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Block Details Modal */}
        <Dialog
          open={!!selectedBlock}
          onOpenChange={() => setSelectedBlock(null)}
        >
          <DialogContent className="bg-white border-gray-200 rounded-2xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-800 text-xl flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl text-white">
                  <Blocks className="w-5 h-5" />
                </div>
                Block #{selectedBlock?.id} Details
              </DialogTitle>
              <DialogDescription>
                View detailed information about this blockchain block including
                tourist data, hashes, and timestamps.
              </DialogDescription>
            </DialogHeader>
            {selectedBlock && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <label className="text-gray-500 text-sm">
                      Tourist Name
                    </label>
                    <p className="text-gray-800 font-semibold">
                      {selectedBlock.touristName}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <label className="text-gray-500 text-sm">Country</label>
                    <p className="text-gray-800 font-semibold">
                      {selectedBlock.country}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <label className="text-gray-500 text-sm">Photo Hash</label>
                  <Badge
                    variant="outline"
                    className="block mt-2 font-mono text-purple-700 border-purple-300 bg-purple-50"
                  >
                    {selectedBlock.photoHash}
                  </Badge>
                </div>

                <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                  <label className="text-gray-500 text-sm">Block Hash</label>
                  <Badge
                    variant="outline"
                    className="block mt-2 font-mono text-orange-700 border-orange-300 bg-orange-50"
                  >
                    {selectedBlock.hash}
                  </Badge>
                </div>

                <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl">
                  <label className="text-gray-500 text-sm">Previous Hash</label>
                  <Badge
                    variant="outline"
                    className="block mt-2 font-mono text-red-700 border-red-300 bg-red-50"
                  >
                    {selectedBlock.previousHash}
                  </Badge>
                </div>

                <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl">
                  <label className="text-gray-500 text-sm">Timestamp</label>
                  <p className="text-gray-800 font-semibold mt-1">
                    {selectedBlock.timestamp}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
