/*
 * Copyright (C) 2013-2014 Vanderbilt University, All rights reserved.
 * 
 * Author:
 * Peng Zhang
 */

"use strict";

define(['js/NodePropertyNames',
        'js/RegistryKeys',
        './BusinessProcessModelingDecorator.Constants',
        './BusinessProcessModeling.META',
        'js/Widgets/DiagramDesigner/DiagramDesignerWidget.Constants',
        'js/Constants',
         'text!../Icons/BasePort.svg'], function (nodePropertyNames,
                                    REGISTRY_KEYS,
                                   BusinessProcessModelingDecoratorConstants,
                                   BPMMETA,
                                   DiagramDesignerWidgetConstants,
                                   CONSTANTS,
                                   PortSvg) {
                                   

    /**
     * A module representing BusinessProcessModelingBaseLane decorator functionality for the SysMLModelingLanguage.
     * @exports BusinessProcessModelingBaseLane
     * @version 1.0
     */
    var BusinessProcessModelingBaseLane,
        FPRightBase = $(PortSvg).find("g.port");

    /**
     * Initializes a new instance of BusinessProcessModelingBaseLane.
     * @constructor
     */
    BusinessProcessModelingBaseLane = function () {

    };

    /**
     * Gets a clone of a port svg icon.
     * @returns {*|jQuery|HTMLElement} Port svg icon.
     */
    BusinessProcessModelingBaseLane.prototype.getPortSVG = function (portType) {

        switch (portType) {
            case 'flowelements':
                return FPRightBase.clone();
        }
       
        return PortBase.clone();
    };

    BusinessProcessModelingBaseLane.prototype._updatePorts = function () {
        var self = this,
            gmeID = this._metaInfo[CONSTANTS.GME_ID],
            client = this._control._client,
            nodeObj = client.getNode(gmeID),
            childrenIDs = nodeObj ?  nodeObj.getChildrenIds() : [],
            leftPorts = [],
            SVGWidth = parseInt(this.skinParts.$svg.attr('width')),
            TOPOFFSET = parseInt(this.skinParts.$svg.find('line')[0].getAttribute('y1')),
            SVGHeight = parseInt(this.skinParts.$svg.attr('height')) - TOPOFFSET,
            //SVGHeight = parseInt(this.skinParts.$svg.find('line')[1].getAttribute('y1')) - TOPOFFSET,
            svgIcon = this.skinParts.$svg;


        // reinitialize the port coordinates with an empty object
        this._portCoordinates = {};
        this.skinParts.$connectorContainer.empty();

        function compare (p1, p2) {
            return p1.y < p2.y;
        }

        if (childrenIDs && childrenIDs.length) {
            for (var i = 0; i <childrenIDs.length; ++i) {

                var portNode = client.getNode(childrenIDs[i]);
                if (!portNode) continue;

                var portPosition = portNode.getRegistry(REGISTRY_KEYS.POSITION),
                    isInport = BPMMETA.TYPE_INFO.isTask(childrenIDs[i]) || BPMMETA.TYPE_INFO.isSubProcess(childrenIDs[i]) || BPMMETA.TYPE_INFO.isStartEvent(childrenIDs[i]) || BPMMETA.TYPE_INFO.isEndEvent(childrenIDs[i]) || BPMMETA.TYPE_INFO.isIntermediateEvent(childrenIDs[i]) || BPMMETA.TYPE_INFO.isGateway(childrenIDs[i]);


                if (isInport) {
                    leftPorts.push({id: childrenIDs[i], y: portPosition.y, type: 'flowelements'});
                }
            }
            leftPorts.sort(compare);
        }

        function renderPorts (ports, left) {

            if (ports.length <= 0) {
                return;
            }
            var length = ports.length,
                portVerticalOffset = SVGHeight / (length + 1),
                portNum,
                portId,
                portType,
                leftOff = left ? 0 : SVGWidth - 1.5 * BusinessProcessModelingDecoratorConstants.PORT_WIDTH,
                topOff,
                portSVG,
                portContainer;

            for (portNum = 0; portNum < length; ++portNum) {
                portId = ports[portNum].id;
                portType = ports[portNum].type;
                

                topOff = portVerticalOffset * (portNum + 1) - BusinessProcessModelingDecoratorConstants.PORT_WIDTH + TOPOFFSET;


                self._portCoordinates[portId] = {
                    'x': leftOff,
                    'y': topOff,
                    'w': BusinessProcessModelingDecoratorConstants.PORT_WIDTH,
                    'h': BusinessProcessModelingDecoratorConstants.PORT_WIDTH,
                    'angle': left ? 180 : 0
                };
                        // get a new port svg

                portSVG = self.getPortSVG(portType);
        
                // set the position of this port

                portSVG.attr("transform", "translate(" + leftOff + "," + topOff + ")");

                // get port placeholder in svg

                portContainer = $(svgIcon[0]).find('.ports');

                if (portContainer.length > 0) {
                    portContainer[0].appendChild(portSVG[0]);

                    // render connector
                    var connectorE = $('<div/>', {'class': DiagramDesignerWidgetConstants.CONNECTOR_CLASS});

                    connectorE.css({
                        'top': self._portCoordinates[portId].y,
                        'left': self._portCoordinates[portId].x
                    });

                    var node = self._control._client.getNode(portId),
                        portName = (node ? node.getAttribute('Description') : '') || (node ? node.getAttribute('name') : '');
                    connectorE.attr('title', portName);

                    if (self._displayConnectors) {

                        // register connectors for creating connections
                        if (self.hostDesignerItem) {
                            self.hostDesignerItem.registerConnectors(connectorE, portId);
                            self.hostDesignerItem.registerSubcomponent(portId, {"GME_ID": portId});
                        } else {
                            self.logger.error("Decorator's hostDesignerItem is not set");
                        }

                        self.skinParts.$connectorContainer.append(connectorE);
                    }
                }
            }
        }


        // delete all ports from svg icon
        svgIcon.find('.port').remove();

        // align left then right ports
        renderPorts(leftPorts, true);
    };


    /**
     * Renders the object based on the meta type.
     * @private
     */
    BusinessProcessModelingBaseLane.prototype._renderMetaTypeSpecificParts = function () {

    };

    /**
     * Gets the connection areas for all connectors associated with this object including ports if there is any.
     * @param id {string} GME id of the port, null if connections has to be specified for this object.
     * @param isEnd {boolean} True if id object is the end point of the connection.
     * @param connectionMetaInfo {object} Source object's meta information.
     * @returns {Array} Connection areas to/from connections can be drawn.
     */
    BusinessProcessModelingBaseLane.prototype.getConnectionAreas = function (id/*, isEnd, connectionMetaInfo*/) {
          
        if (this._portCoordinates[id]) {
            return [{
                "id": id,
                "x1": this._portCoordinates[id].x + this._portCoordinates[id].w / 2,
                "y1": this._portCoordinates[id].y + this._portCoordinates[id].h / 2,
                "x2": this._portCoordinates[id].x + this._portCoordinates[id].w / 2,
                "y2": this._portCoordinates[id].y + this._portCoordinates[id].h / 2,
                "angle1": this._portCoordinates[id].angle,
                "angle2": this._portCoordinates[id].angle,
                "len": 20
            }];
        } else {
            return [];
        }
    };

    return BusinessProcessModelingBaseLane;
});
