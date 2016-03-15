// StudentCode.CORE.js
////////////////////////////////////////////////////////////////////////////////////////

var STATE_PICK_LOCATIONS = 0;
var STATE_WALK = 1;
var STATE = STATE_PICK_LOCATIONS;

var SHOW_NODE_COOL_DOWN_AMOUNT = 10.0;
var PAUSE_COOL_DOWN_AMOUNT = 10.0;

// Mouse and Cheese Variables
var _MouseImgX = 0;
var _MouseImgY = 0;
var _CheeseImgX = 0;
var _CheeseImgY = 0;

var _TargetNode = 0;
var _MoveValue = 1.5;

var showNodesCoolDown = 0.0;
var pauseCoolDown = 0.0;

var showNodes = false;
var isPaused = false;

function OnInitialize() {
    _InitializeAllNodes();

    _StartNode = NODES[0];
    _MouseImgX = _StartNode.x;
    _MouseImgY = _StartNode.y;
}

function OnFrame() {
    _ClearScreen();
    _DrawBackground();

    HandleNodeToggle();

    DetectPause();
    if (isPaused == true) {
        _DrawMouseCheese();
        return;
    }

    //_ClearScreen();
    //_DrawBackground();

    if (STATE == STATE_PICK_LOCATIONS) {
        do {
            var index = Math.floor(Math.random() * (NODES.length - 1));
            _EndNode = NODES[index];
        } while (_EndNode == _StartNode);

        _CheeseImgX = _EndNode.x;
        _CheeseImgY = _EndNode.y;
        //_ResetAllNodeSealedValues(NODES);
        _PlotRoute(_StartNode, _EndNode);
        STATE = STATE_WALK;
        // Select the next node for the mousel
        _TargetNode = 0;
    }
    if (STATE == STATE_WALK) {
        // Walk the mouse towards the next node of the graph
        var node = _EndNode.Path[_TargetNode];
        var vx = node.x - _MouseImgX;
        var vy = node.y - _MouseImgY;
        var length = Math.sqrt(vx * vx + vy * vy);
        if (length > 0) {
            vx /= length;
            vy /= length;
            vx *= _MoveValue;
            vy *= _MoveValue;
            _MouseImgX += vx;
            _MouseImgY += vy;
        }
        // If we have arrived at our destination node, pick the next node in the path
        if (length <= 10) {
            _TargetNode += 1;
            if (_TargetNode >= _EndNode.Path.length) {
                // Arrived at the last node
                _StartNode = _EndNode;
                _ResetAllNodeSealedValues(NODES);
                ResetAllNodePathValues(NODES);
                //_ResetAllNodeSealedValues();
                STATE = STATE_PICK_LOCATIONS;
            }
        }
    }

    //HandleNodeToggle();

    //if (_KEYBOARD_SPACE == true && showNodesCoolDown <= 0.0) {
    //    showNodesCoolDown = SHOW_NODE_COOL_DOWN_AMOUNT;
    //    ToggleNodes();
    //}
    //showNodesCoolDown -= 0.01;
    //if(showNodes == true) _DrawNodeInformation();
    _DrawMouseCheese();

    //if (STATE == STATE_PICK_LOCATIONS) {

    //}
}

function _DrawNodeInformation() {
    _DrawGraph(NODES);
    _DrawPath(_EndNode);
}

function _DrawGraph(nodes) {
    // Draw all Connections
    for (var n = 0 ; n < nodes.length; n++) {
        var node = nodes[n]
        for (var m = 0; m < node.outboundEdges.length; m++) {
            var edge = node.outboundEdges[m];
            _DrawNodeConnectionLine(node, edge.outboundNode);
        }
    }

    // Draw all Nodes
    for (var n = 0; n < nodes.length ; n++) {
        var node = nodes[n];

        if (node.IsStart) {
            _DrawImage("./Images/NodeStyle2.png", node.x - NODE_WIDTH / 2, node.y - NODE_HEIGHT / 2);
        }
        else if (node.IsEnd) {
            _DrawImage("./Images/NodeStyle4.png", node.x - NODE_WIDTH / 2, node.y - NODE_HEIGHT / 2);
        }
        else if (node.IsPath == true) {
            _DrawImage("./Images/NodeStyle5.png", node.x - NODE_WIDTH / 2, node.y - NODE_HEIGHT / 2);
        }
        else if (node.Sealed) {
            _DrawImage("./Images/NodeStyle3.png", node.x - NODE_WIDTH / 2, node.y - NODE_HEIGHT / 2);
        }
        //else if (node.IsStart) {
        //    _DrawImage("./Images/NodeStyle2.png", node.x - NODE_WIDTH / 2, node.y - NODE_HEIGHT / 2);
        //}
        //else if(node.IsEnd) {
        //    _DrawImage("./Images/NodeStyle4.png", node.x - NODE_WIDTH / 2, node.y - NODE_HEIGHT / 2);
        //}
        else {
            _DrawImage("./Images/NodeStyle1.png", node.x - NODE_WIDTH / 2, node.y - NODE_HEIGHT / 2);
        }
    }
}

function _DrawMouseCheese() {
    _DrawImage("./Images/zombie_char.png", _MouseImgX - 32 / 2, _MouseImgY - 48 / 2);
    _DrawImage("./Images/brains_icon.png", _CheeseImgX - 36 / 2, _CheeseImgY - 36 / 2);
}

function _DrawBackground() {
    _DrawImage("./Images/Maze.png", 0, 0, 728, 532);
}

function HandleNodeToggle() {
    if (_KEYBOARD_SPACE == true && showNodesCoolDown <= 0.0) {
        showNodesCoolDown = SHOW_NODE_COOL_DOWN_AMOUNT;
        ToggleNodes();
    }
    showNodesCoolDown -= 1.0;
    if (showNodesCoolDown < -99999.0) showNodesCoolDown = 0.0;
    if (showNodes == true) _DrawNodeInformation();
}

function ToggleNodes() {
    showNodes = !showNodes;
}

function DetectPause() {
    if (_KEYBOARD_LEFTARROW || _KEYBOARD_UPARROW || _KEYBOARD_RIGHTARROW || _KEYBOARD_DOWNARROW) {
        if (pauseCoolDown < 0.0) {
            pauseCoolDown = PAUSE_COOL_DOWN_AMOUNT;
            isPaused = !isPaused;
        }
    }
    pauseCoolDown -= 1.0;
    if (pauseCoolDown < -99999.0) pauseCoolDown = 0.0;
}