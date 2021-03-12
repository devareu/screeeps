var roleroadmaint = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = 'harvest';
            creep.say('🔄 harvest');
	    }
		
		/* var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
	    if(!creep.memory.building == 'build' && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = 'build';
	        creep.say('🚧 build');
	    } */
		
		var repairtargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => (structure.hits < structure.hitsMax) && (structure.structureType == 'road')});
		//console.log(repairtargets[0])
		if(!creep.memory.building == 'repair' && creep.store.getFreeCapacity() == 0 && repairtargets.length > 0) {
	        creep.memory.building = 'repair';
	        creep.say('🚧 repair');
	    }
		
		switch(creep.memory.building) {
				case 'harvest':
					var sources = creep.room.find(FIND_SOURCES);
					if(creep.store.getFreeCapacity() > 0){
						if(creep.harvest(sources[3]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(sources[3], {visualizePathStyle: {stroke: '#ffaa00'}});
							creep.say('🔄 harvest');
						}
					}
					else {
						creep.memory.building = 'repair';
						creep.say('🚧 repair');
					}
				break;
				
				case 'repair':
					if(repairtargets.length > 0) {
						if(creep.repair(repairtargets[0]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(repairtargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}
					else {
						creep.memory.building = 'sleep';
						creep.say('🚧 sleep');
					}	
				break;
				
/* 				case 'build':
					if(targets.length > 0) {
						if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}
					else {creep.memory.building = 'sleep';}
				break; */
				
				case 'sleep':
					creep.moveTo(26,16, {visualizePathStyle: {stroke: '#ffffff'}});
					creep.say('🔄 rmsleep');
					/* if(targets.length > 0) {creep.memory.building = 'build';} */
					if(repairtargets.length > 0) {creep.memory.building = 'repair';}
				break;
		}
	}
};

module.exports = roleroadmaint;