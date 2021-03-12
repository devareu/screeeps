var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = 'harvest';
            creep.say('🔄 harvest');
	    }
		
		var repairtargetspriority = creep.room.find(FIND_STRUCTURES, {filter: (structure) => (structure.hits < 1000)});
		var repairtargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => (structure.hits < structure.hitsMax) && (structure.structureType != 'road') && (structure.structureType != 'constructedWall')});
		console.log(repairtargets[0])
		if(!creep.memory.building == 'build' && creep.store.getFreeCapacity() == 0 && repairtargetspriority.length > 0)  {
	        creep.memory.building = 'priority';
	        creep.say('🚧 priority');
	    }
		
		var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
	    if(!creep.memory.building == 'build' && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = 'build';
	        creep.say('🚧 build');
	    }
		
		
		//  || repairtargetspriority.length > 0
		switch(creep.memory.building) {
				case 'harvest':
					var sources = creep.room.find(FIND_SOURCES);
					if(creep.store.getFreeCapacity() > 0){
						if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
							creep.say('🔄 harvest');
						}
					}
					else {
						creep.memory.building = 'build';
						creep.say('🚧 build');
					}
				break;

				case 'build':
					if(targets.length > 0) {
						if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}
					else {creep.memory.building = 'priority';}
				break;
				
				case 'priority':
				// repair priorities anything below 1000 hit points
					if(repairtargetspriority.length > 0) {
						creep.say('🚧 priority');
						if(creep.repair(repairtargetspriority[0]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(repairtargetspriority[0], {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}
					else {
						creep.memory.building = 'repair';
						creep.say('🚧 repair');
					}
				break;
				
				case 'repair':				
				// original repairs - no walls and roads
					if(repairtargets.length > 0) {
						if(creep.repair(repairtargets[0]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(repairtargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}
					// send back to priority check or to sleep
					if(repairtargets.length > 0) {
						creep.memory.building = 'repair';
					}
					if(repairtargetspriority.length > 0) {
						creep.memory.building = 'priority';
					}
					if(repairtargetspriority.length == 0 && repairtargets.length == 0){
						creep.memory.building = 'sleep';
						creep.say('🔄 sleep');
					}
				break;
				
				case 'sleep':
					creep.moveTo(18,25, {visualizePathStyle: {stroke: '#ffffff'}});
					creep.say('🔄 bsleep');
					if(repairtargets.length > 0) {creep.memory.building = 'repair';}
					if(targets.length > 0) {creep.memory.building = 'build';}
				break;
		}
	}
};

module.exports = roleBuilder;