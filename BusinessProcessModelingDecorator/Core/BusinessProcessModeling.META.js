define(['underscore'], function (_underscore) {
    'use strict';

    var _metaID = 'BusinessProcessModeling.META.js',

        //META ASPECT TYPES
        META_TYPES = {
            'Activity': 'Activity',
            'Annotation': 'Annotation',
            'Artifact': 'Artifact',
            'BPMFolder': 'BPMFolder',
            'BPMMetaLanguage': 'BPMMetaLanguage',
            'BPModel': 'BPModel',
            'Complex': 'Complex',
            'DataObject': 'DataObject',
            'EndEvent': 'EndEvent',
            'Event': 'Event',
            'EventBased': 'EventBased',
            'EventBasedG': 'EventBasedG',
            'Exclusive': 'Exclusive',
            'ExclusiveEventBased': 'ExclusiveEventBased',
            'Gateway': 'Gateway',
            'Inclusive': 'Inclusive',
            'IntermediateEvent': 'IntermediateEvent',
            'Lane': 'Lane',
            'Parallel': 'Parallel',
            'ParallelEventBased': 'ParallelEventBased',
            'Pool': 'Pool',
            'StartEvent': 'StartEvent',
            'SubProcess': 'SubProcess',
            'Task': 'Task',
            'TaskBasedG': 'TaskBasedG'
        },
        ExcludedMETA = {
			'FCO': 'FCO',
			'Documentation': 'Documentation'
        },
        client = WebGMEGlobal.Client;

    function _getMetaTypes() {
        var metaNodes = client.getAllMetaNodes(),
            dictionary = {},
            i,
            name;

        for (i = 0; i < metaNodes.length; i += 1) {
            name = metaNodes[i].getAttribute('name');
            if (META_TYPES[name]) {
                dictionary[name] = metaNodes[i].getId();
            }
        }

        return dictionary;
    }
    function _getDecoredMetaTypes() {
        var metaNodes = client.getAllMetaNodes(),
            dictionary = {},
            i,
            name;

        for (i = 0; i < metaNodes.length; i += 1) {
            name = metaNodes[i].getAttribute('name');
            if (META_TYPES[name] && !ExcludedMETA[name]) {
                dictionary[name] = metaNodes[i].getId();
            }
        }

        return dictionary;
    }
    function _getMetaTypesOf(objId) {
        var orderedMetaList = Object.keys(META_TYPES).sort(),
            metaDictionary = _getMetaTypes(),
            i,
            result = [];

        for (i = 0; i < orderedMetaList.length; i += 1) {
            if (safeTypeCheck(objId, metaDictionary[orderedMetaList[i]])) {
                result.push(orderedMetaList[i]);
            }
        }

        return result;
    }

    function safeTypeCheck(id, metaId) {
        if (typeof metaId === 'string') {
            return client.isTypeOf(id, metaId);
        } else {
            return false;
        }
    }

    //META ASPECT TYPE CHECKING
    var _isActivity = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Activity]);};
	var _isAnnotation = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Annotation]);};
	var _isArtifact = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Artifact]);};
	var _isBPMFolder = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.BPMFolder]);};
	var _isBPMMetaLanguage = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.BPMMetaLanguage]);};
	var _isBPModel = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.BPModel]);};
	var _isComplex = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Complex]);};
	var _isDataObject = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.DataObject]);};
	var _isDocumentation = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Documentation]);};
	var _isEndEvent = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.EndEvent]);};
	var _isEvent = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Event]);};
	var _isEventBased = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.EventBased]);};
	var _isEventBasedG = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.EventBasedG]);};
	var _isExclusive = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Exclusive]);};
	var _isExclusiveEventBased = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.ExclusiveEventBased]);};
	var _isFCO = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.FCO]);};
	var _isGateway = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Gateway]);};
	var _isInclusive = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Inclusive]);};
	var _isIntermediateEvent = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.IntermediateEvent]);};
	var _isLane = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Lane]);};
	var _isParallel = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Parallel]);};
	var _isParallelEventBased = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.ParallelEventBased]);};
	var _isPool = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Pool]);};
	var _isStartEvent = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.StartEvent]);};
	var _isSubProcess = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.SubProcess]);};
	var _isTask = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.Task]);};
	var _isTaskBasedG = function (objID) { return safeTypeCheck(objID, _getMetaTypes()[META_TYPES.TaskBasedG]);};

	

    //return utility functions
    return {
        getMetaTypes: _getMetaTypes,
        getMetaTypesOf: _getMetaTypesOf,
        getDecoredMetaTypes: _getDecoredMetaTypes,
        TYPE_INFO: {
			isActivity: _isActivity,
			isAnnotation: _isAnnotation,
			isArtifact: _isArtifact,
			isBPMFolder: _isBPMFolder,
			isBPMMetaLanguage: _isBPMMetaLanguage,
			isBPModel: _isBPModel,
			isComplex: _isComplex,
			isDataObject: _isDataObject,
			isDocumenttation: _isDocumentation,
			isEndEvent: _isEndEvent,
			isEvent: _isEvent,
			isEventBased: _isEventBased,
			isEventBasedG: _isEventBasedG,
			isExclusive: _isExclusive,
			isExclusiveEventBased: _isExclusiveEventBased,
			isFCO: _isFCO,
			isGateway: _isGateway,
			isInclusive: _isInclusive,
			isIntermediateEvent: _isIntermediateEvent,
			isLane: _isLane,
			isParallel: _isParallel,
			isParallelEventBased: _isParallelEventBased,
			isPool: _isPool,
			isStartEvent: _isStartEvent,
			isSubProcess: _isSubProcess,
			isTask: _isTask,
			isTaskBasedG: _isTaskBasedG,
		}
    };
});