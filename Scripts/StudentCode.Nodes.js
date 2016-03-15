// StudentCode.Nodes.js
////////////////////////////////////////

var NODE_WIDTH = 20;
var NODE_HEIGHT = 20;

// Definition of Node
function Node(name, x, y) {
    this.x = x;
    this.y = y;
    this.name = name;

    // Edges
    this.outboundEdges = [];
    this.inboundEdges = [];

    // Dijkstra's Algorithm Stuff
    this.Path = [];
    this.PathLength = 99999;
    this.Sealed = false;
    this.IsStart = false;
    this.IsEnd = false;
    this.IsPath = false;
}

// Array of Nodes
var NODES = []
var _StartNode = null;
var _EndNode = null;

// Definition of an Edge
function Edge() {
    this.value = 0;
    this.inboundNode = null;
    this.outboundNode = null;
}


// Utility Functions
////////////////////////////////////////////////////
function _CreateNode(name, x, y) {
    var node = new Node(name, x, y);
    NODES.push(node);
    return node;
}

// Connects node1 to node2. 
// Will make the connection in reverse if given a true value for bidirectional
function _ConnectNodes(node1, node2, bidirectional) {
    if (bidirectional == undefined) bidirectional = false;
    var edge1 = new Edge();

    // Set Connection from node1 to node 2
    edge1.inboundNode = node1;
    edge1.outboundNode = node2;
    node1.outboundEdges.push(edge1);
    node2.inboundEdges.push(edge1);

    // Calculate and store edge information
    var Vx = node1.x - node2.x;
    var Vy = node1.y - node2.y;
    var dist = Math.sqrt(Vx * Vx + Vy * Vy);
    edge1.value = dist;

    // If bidirectional, do the same for node2 to node1
    if (bidirectional) {
        var edge2 = new Edge();
        edge2.inboundNode = node2;
        edge2.outboundNode = node1;
        edge2.value = dist;
        node1.inboundEdges.push(edge2);
        node2.outboundEdges.push(edge2);
    }
}

// Creates the bidirectional connection from node1 to/from node2
function _ConnectBidirectionalNodes(node1, node2) {
    _ConnectNodes(node1, node2, true);
}

// Draws a line between node1 and node 2
function _DrawNodeConnectionLine(node1, node2) {
    draw.strokeStyle = "Blue";
    draw.lineWidth = 1;
    draw.beginPath();
    draw.moveTo(node1.x, node1.y);
    draw.lineTo(node2.x, node2.y);
    draw.stroke();
}

// CODE FOR WORKING SET
/////////////////////////////////////////////////////////////////////////////
var _WORKING_SET = [];
var _INFINITY_ = 99999.0;

// Copies the path from node1 and overwrites node2's path
function _CopyPath(node2, node1) {
    node2.Path = [];
    for (var n = 0; n < node1.Path.length; n++) {
        node2.Path.push(node1.Path[n]);
    }
}

// Determines if the given node (node1) is in the WorkingSet (WS)
function _IsNodeInSet(WS, node1) {
    for (var n = 0; n < WS.length; n++) {
        var node2 = WS[n];
        if (node1.name == node2.name) return true;
    }
    return false;
}

// Plot the Route from the start node to the end node
function _PlotRoute(start, end) {
    // Loop through all nodes.
    // Clear their paths and set the path length to _INFINITY_
    for (var n = 0; n < NODES.length; n++) {
        var node = NODES[n];
        node.Path = [];
        node.PathLength = _INFINITY_;
    }

    // Set the Path Length of the starting node to Zero
    start.PathLength = 0;
    start.Path.push(start);

    // Clear the Working Set
    _WORKING_SET = [];

    // Append the start node to the working set
    _WORKING_SET.push(start);

    //var AllSealed = false;                              // ERROR CHECKING
    //var SealedCount = 0;                                // ERROR CHECKING

    // WHile the ending node is not sealed...
    while (!end.Sealed) {
        // For every node in the working set which is not sealed
        for (var n = 0; n < _WORKING_SET.length; n++) {
            var node1 = _WORKING_SET[n];

            //if (SealedCount >= _WORKING_SET.length) AllSealed = true;               // ERROR CHECKING

            //if (_WORKING_SET.length >= 69) {
            //    // Do nothing. Just want to break here.
            //    node1 = node1;
            //}

            if (node1.Sealed) {
                //SealedCount++;                                                      // ERROR CHECKING
                // If every node in the working set is sealed, and the end node is not sealed, then exit the function and start over
                //if (AllSealed) {                                                    // ERROR CHEKCING
                //    // Do stuff                                                     // ERROR CHEKCING
                //    _ResetAllNodeSealedValues(_WORKING_SET);
                //    AllSealed = false;
                //    SealedCount = 0;
                //}                                                                   // ERROR CHEKCING
                // Else Continue
                continue;
            }
            // For each node adjacent to this one, which isn't sealed...
            for (var m = 0; m < node1.outboundEdges.length; m++) {
                // Let E be the edge from node1 to node2
                var edge = node1.outboundEdges[m];
                var node2 = edge.outboundNode;
                // Ignore the node if it is sealed
                if (node2.Sealed) continue;
                // Ignore the node if it is going to itself
                if (node1.name == node2.name) continue;
                // Add the node to the working set
                if (!_IsNodeInSet(_WORKING_SET, node2)) _WORKING_SET.push(node2);

                // If the path from node1 along this edge to node2 has a shorter length
                // than what's on node2, overwrite node2's path.
                if (node1.PathLength + edge.value < node2.PathLength) {
                    // Copy the path from node1 onto node2
                    _CopyPath(node2, node1);
                    // Append this edge to that path
                    node2.Path.push(node2);
                    // Set the path length on node2
                    node2.PathLength = node1.PathLength + edge.value;
                }
            }

            // Seal off this node, if all it's adjancencies have paths
            var bAllHavePaths = true;
            for (var m = 0; m < node1.outboundEdges.length; m++) {
                // Get the adjacency node
                var edge = node1.outboundEdges[m];
                var node2 = edge.outboundNode;
                if (node2.Path.length == 0) {
                    bAllHavePaths = false;
                }
            }

            if (bAllHavePaths) node1.Sealed = true;
            // If the path length on the ending node is less than Infinity then seal off the ending node...
            if (end.PathLength < _INFINITY_) end.Sealed = true;
        }
    }
}

// Draw a Path to the End node (endNode)
function _DrawPath(endNode) {
    for (var n = 0; n < endNode.Path.length - 1; n++) {
        var node1 = endNode.Path[n];
        var node2 = endNode.Path[n + 1];
        _DrawNodeLine(node1, node2, 3);
        node1.IsPath = true;
    }
}

// Resets the Sealed values of all nodes in Node Array (NArr) to false;
function _ResetAllNodeSealedValues(NArr) {
    for (var n = 0; n < NArr.length; n++) {
        NArr[n].Sealed = false;
    }
}

function ResetAllNodePathValues(arr) {
    for (var n = 0; n < arr.length; ++n) {
        arr[n].IsPath = false;
    }
}
//function _ResetAllNodeSealedValues() {
//    for (var n = 0; n < NODES.length; n++) {
//        NODES[n].Sealed = false;
//    }
//}

// Draws a line from node1 to node2 with the designated line thickness
function _DrawNodeLine(node1, node2, lineThickness) {
    if (lineThickness == undefined) lineThickness = 1;

    draw.strokeStyle = "Red";
    draw.lineWidth = lineThickness;
    draw.beginPath();
    draw.moveTo(node1.x, node1.y);
    draw.lineTo(node2.x, node2.y);
    draw.stroke();
}

// CODE FOR NODE INITIALIZATION
/////////////////////////////////////////////////////////////////////////////
function _InitializeAllNodes() {
    // Create all nodes
    var node1 = _CreateNode("node1", 30, 45);
    var node2 = _CreateNode("node2", 125, 45);
    var node3 = _CreateNode("node3", 170, 45);
    var node4 = _CreateNode("node4", 220, 45);
    var node5 = _CreateNode("node5", 265, 45);
    var node6 = _CreateNode("node6", 315, 45);
    var node7 = _CreateNode("node7", 360, 45);
    var node8 = _CreateNode("node8", 410, 45);
    var node9 = _CreateNode("node9", 700, 45);
    var node10 = _CreateNode("node10", 125, 90);
    var node11 = _CreateNode("node11", 170, 90);
    var node12 = _CreateNode("node12", 220, 90);
    var node13 = _CreateNode("node13", 265, 90);
    var node14 = _CreateNode("node14", 410, 90);
    var node15 = _CreateNode("node15", 700, 90);
    var node16 = _CreateNode("node16", 30, 140);
    var node17 = _CreateNode("node17", 265, 140);
    var node18 = _CreateNode("node18", 315, 140);
    var node19 = _CreateNode("node19", 360, 140);
    var node20 = _CreateNode("node20", 410, 140);
    var node21 = _CreateNode("node21", 460, 140);
    var node22 = _CreateNode("node22", 510, 140);
    var node23 = _CreateNode("node23", 550, 140);
    var node24 = _CreateNode("node24", 600, 140);
    var node25 = _CreateNode("node25", 700, 140);
    var node26 = _CreateNode("node26", 30, 190);
    var node27 = _CreateNode("node27", 220, 190);
    var node28 = _CreateNode("node28", 265, 190);
    var node29 = _CreateNode("node29", 410, 190);
    var node30 = _CreateNode("node30", 460, 190);
    var node31 = _CreateNode("node31", 510, 190);
    var node32 = _CreateNode("node32", 650, 190);
    var node33 = _CreateNode("node33", 700, 190);
    var node34 = _CreateNode("node34", 75, 235);
    var node35 = _CreateNode("node35", 170, 235);
    var node36 = _CreateNode("node36", 315, 235);
    var node37 = _CreateNode("node37", 360, 235);
    var node38 = _CreateNode("node38", 460, 235);
    var node39 = _CreateNode("node39", 510, 235);
    var node40 = _CreateNode("node40", 550, 235);
    var node41 = _CreateNode("node41", 600, 235);
    var node42 = _CreateNode("node42", 700, 235);
    var node43 = _CreateNode("node43", 75, 280);
    var node44 = _CreateNode("node44", 220, 280);
    var node45 = _CreateNode("node45", 265, 280);
    var node46 = _CreateNode("node46", 360, 280);
    var node47 = _CreateNode("node47", 410, 280);
    var node48 = _CreateNode("node48", 460, 280);
    var node49 = _CreateNode("node49", 510, 280);
    var node50 = _CreateNode("node50", 550, 280);
    var node51 = _CreateNode("node51", 650, 280);
    var node52 = _CreateNode("node52", 700, 280);
    var node53 = _CreateNode("node53", 30, 335);
    var node54 = _CreateNode("node54", 170, 335);
    var node55 = _CreateNode("node55", 315, 335);
    var node56 = _CreateNode("node56", 410, 335);
    var node57 = _CreateNode("node57", 75, 380);
    var node58 = _CreateNode("node58", 125, 380);
    var node59 = _CreateNode("node59", 265, 380);
    var node60 = _CreateNode("node60", 360, 380);
    var node61 = _CreateNode("node61", 410, 380);
    var node62 = _CreateNode("node62", 460, 380);
    var node63 = _CreateNode("node63", 510, 380);
    var node64 = _CreateNode("node64", 600, 380);
    var node65 = _CreateNode("node65", 650, 380);
    var node66 = _CreateNode("node66", 700, 380);
    var node67 = _CreateNode("node67", 220, 425);
    var node68 = _CreateNode("node68", 315, 425);
    var node69 = _CreateNode("node69", 360, 425);
    var node70 = _CreateNode("node70", 550, 425);
    var node71 = _CreateNode("node71", 700, 425);
    var node72 = _CreateNode("node72", 30, 475);
    var node73 = _CreateNode("node73", 75, 475);
    var node74 = _CreateNode("node74", 125, 475);
    var node75 = _CreateNode("node75", 170, 475);
    var node76 = _CreateNode("node76", 510, 475);
    var node77 = _CreateNode("node77", 550, 475);
    var node78 = _CreateNode("node78", 700, 475);
    var node79 = _CreateNode("node79", 700, 335);
    var node80 = _CreateNode("node80", 75, 90);

    // Connect all Nodes
    _ConnectBidirectionalNodes(node1, node2);
    _ConnectBidirectionalNodes(node1, node16);
    _ConnectBidirectionalNodes(node2, node10);
    _ConnectBidirectionalNodes(node3, node4);
    _ConnectBidirectionalNodes(node3, node11);
    _ConnectBidirectionalNodes(node4, node12);
    _ConnectBidirectionalNodes(node5, node6);
    _ConnectBidirectionalNodes(node5, node13);
    _ConnectBidirectionalNodes(node6, node18);
    _ConnectBidirectionalNodes(node7, node8);
    _ConnectBidirectionalNodes(node7, node19);
    _ConnectBidirectionalNodes(node8, node9);
    _ConnectBidirectionalNodes(node8, node14);
    _ConnectBidirectionalNodes(node10, node11);
    _ConnectBidirectionalNodes(node10, node80);
    _ConnectBidirectionalNodes(node12, node13);
    _ConnectBidirectionalNodes(node14, node15);
    _ConnectBidirectionalNodes(node16, node17);
    _ConnectBidirectionalNodes(node19, node20);
    _ConnectBidirectionalNodes(node21, node22);
    _ConnectBidirectionalNodes(node22, node23);
    _ConnectBidirectionalNodes(node20, node29);
    _ConnectBidirectionalNodes(node22, node31);
    _ConnectBidirectionalNodes(node15, node25);
    _ConnectBidirectionalNodes(node24, node25);
    _ConnectBidirectionalNodes(node25, node33);
    _ConnectBidirectionalNodes(node32, node33);
    _ConnectBidirectionalNodes(node26, node27);
    _ConnectBidirectionalNodes(node28, node17);
    _ConnectBidirectionalNodes(node28, node29);
    _ConnectBidirectionalNodes(node31, node30);
    _ConnectBidirectionalNodes(node34, node35);
    _ConnectBidirectionalNodes(node36, node37);
    _ConnectBidirectionalNodes(node37, node38);
    _ConnectBidirectionalNodes(node30, node38);
    _ConnectBidirectionalNodes(node39, node40);
    _ConnectBidirectionalNodes(node23, node40);
    _ConnectBidirectionalNodes(node24, node41);
    _ConnectBidirectionalNodes(node41, node42);
    _ConnectBidirectionalNodes(node34, node43);
    _ConnectBidirectionalNodes(node43, node44);
    _ConnectBidirectionalNodes(node28, node45);
    _ConnectBidirectionalNodes(node37, node46);
    _ConnectBidirectionalNodes(node45, node46);
    _ConnectBidirectionalNodes(node47, node48);
    _ConnectBidirectionalNodes(node49, node50);
    _ConnectBidirectionalNodes(node51, node52);
    _ConnectBidirectionalNodes(node42, node52);
    _ConnectBidirectionalNodes(node26, node53);
    _ConnectBidirectionalNodes(node53, node54);
    _ConnectBidirectionalNodes(node55, node56);
    _ConnectBidirectionalNodes(node47, node56);
    _ConnectBidirectionalNodes(node52, node79);
    _ConnectBidirectionalNodes(node57, node58);
    _ConnectBidirectionalNodes(node45, node59);
    _ConnectBidirectionalNodes(node60, node61);
    _ConnectBidirectionalNodes(node48, node62);
    _ConnectBidirectionalNodes(node62, node63);
    _ConnectBidirectionalNodes(node49, node63);
    _ConnectBidirectionalNodes(node41, node64);
    _ConnectBidirectionalNodes(node51, node65);
    _ConnectBidirectionalNodes(node65, node66);
    _ConnectBidirectionalNodes(node53, node72);
    _ConnectBidirectionalNodes(node72, node73);
    _ConnectBidirectionalNodes(node57, node73);
    _ConnectBidirectionalNodes(node58, node74);
    _ConnectBidirectionalNodes(node54, node75);
    _ConnectBidirectionalNodes(node75, node76);
    _ConnectBidirectionalNodes(node44, node67);
    _ConnectBidirectionalNodes(node67, node68);
    _ConnectBidirectionalNodes(node55, node68);
    _ConnectBidirectionalNodes(node60, node69);
    _ConnectBidirectionalNodes(node69, node70);
    _ConnectBidirectionalNodes(node50, node70);
    _ConnectBidirectionalNodes(node70, node71);
    _ConnectBidirectionalNodes(node66, node71);
    _ConnectBidirectionalNodes(node71, node78);
    _ConnectBidirectionalNodes(node78, node77);
    _ConnectBidirectionalNodes(node44, node27);
}