var roleGlobal =
{
run: function(creep)
{
	{//Creep Action Code
		function deliverEnergy(creep, thisRoom)
		{
			let spawnNannys = _.filter(Game.creeps, (creep) => creep.memory.role == 'spawnNanny');
			if(spawnNannys.length == 1)
			{
				var target
				switch(creep.memory.weight)
				{
					case 0:
					case 2:
					{
						target = Game.getObjectById(thisRoom.spawnContainer)
						if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
						{
							target = Game.getObjectById(thisRoom.controllerContainer)
						}
						break;
					}
					case 1:
					case 3:
					{
						target = Game.getObjectById(thisRoom.controllerContainer)
						if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
						{
							target = Game.getObjectById(thisRoom.spawnContainer)
						}
						break;
					}
				}
				if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
					creep.say('🔄 Dlvr');
				}			
			}
			else
			{
				let primaryTargets = creep.room.find(FIND_MY_STRUCTURES,
				{
					filter: (structure) =>
					{
						return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
					}
				});
				if(primaryTargets.length > 0)
				{
					if(creep.transfer(primaryTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
					{
						creep.moveTo(primaryTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
						creep.say('🔄 Dlvr');
					}
				}
				else 
				{
					let secondaryTargets = creep.room.find(FIND_STRUCTURES,
					{
						filter: (structure) =>
						{
						return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
							structure.store.getFreeCapacity() > 0;
						}
					});
					if (secondaryTargets.length > 0)
					{
						if(creep.transfer(secondaryTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
						{
							creep.moveTo(secondaryTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
							creep.say('🔄 Dlvr');
						}
					}
					else
					{
						sleep(creep,thisRoom);
					}
				}
			}
		}
		
		function placeEnergy(creep, thisRoom)// Truck Logic
		{
			let trucks = _.filter(Game.creeps, (creep) => creep.memory.role == 'truck');
			if(trucks.length >= 1)
			{
				let sourceStore = Game.getObjectById(thisRoom.sourceStore)
				if(creep.transfer(sourceStore, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				{
				creep.moveTo(sourceStore);
				creep.say('🔄 PlcNrg');
				}
			}
			else
			{
				deliverEnergy(creep, thisRoom);
			}			
		}
		
		function findEnergy(creep, thisRoom)
		{
			let targets = creep.room.find(FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
					&& structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getCapacity()
				}
			});
			var primaryTarget
			if(targets.length >= 1)
			{
				if(targets.length > 1)
				{
					primaryTarget = creep.pos.findClosestByPath(targets);
				}
				else
				{
					primaryTarget = targets[0];
				}
				if(creep.withdraw(primaryTarget,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(primaryTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
					creep.say('🔄fndNrg');
				}
			}
			else
			{
				harvest(creep, thisRoom);
			}
		}
		
		function harvest(creep, thisRoom)
		{
			if(creep.harvest(Game.getObjectById(thisRoom.sources[creep.memory.weight].id)) == ERR_NOT_IN_RANGE)
			{
				creep.moveTo(Game.getObjectById(thisRoom.sources[creep.memory.weight].id), {visualizePathStyle: {stroke: '#ffaa00'}});
				creep.say('🔄 Harvest');
			}
		}
		
		function pullFromStorage(creep, thisRoom)
		{
			if(creep.withdraw(Game.getObjectById(thisRoom.sourceStore),RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
			{
				creep.moveTo(Game.getObjectById(thisRoom.sourceStore), {visualizePathStyle: {stroke: '#ffaa00'}});
				creep.say('🔄 PkStg');
			}
		}
		
		function renew(creep, thisRoom)
		{
			let thisSpawn = Game.getObjectById(thisRoom.spawns[0].id)
			if(thisSpawn.renewCreep(creep) == ERR_NOT_IN_RANGE)
			{
				creep.moveTo(thisSpawn, {visualizePathStyle: {stroke: '#ffaa00'}});
				creep.say('🔄 Renew');
			}
		}
		
		function sleep(creep, thisRoom)
		{
			creep.moveTo(thisRoom.cityCenter.pos.x+5,thisRoom.cityCenter.pos.y+5, {visualizePathStyle: {stroke: '#ffffff'}});
			creep.say('🔄 Sleep');
		}
		
		function work(creep, thisRoom)
		{
			switch(creep.memory.role)
			{
				case 'builder':
				{
					var repairtargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => (structure.hits < structure.hitsMax) && (structure.structureType != 'road')});
					if(repairtargets.length > 0) 
					{
						if(creep.repair(repairtargets[0]) == ERR_NOT_IN_RANGE) 
						{
							creep.say('Rpr')
							creep.moveTo(repairtargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}
					else
					{
						var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
						if(targets.length > 0)
						{
							if(creep.build(targets[0]) == ERR_NOT_IN_RANGE)
							{
								creep.say('Bld')
								creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
							}
						}
						else
						{
							sleep(creep,thisRoom);
						}
					}				
					break;
				}
				case 'harvester':
				{
					break;
				}
				case 'roadmaint':
				{
					var repairtargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => (structure.hits < structure.hitsMax) && (structure.structureType == 'road')});
					if(repairtargets.length > 0) 
					{
						if(creep.repair(repairtargets[0]) == ERR_NOT_IN_RANGE) 
						{							
							creep.say('RprRd')
							creep.moveTo(repairtargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}
					else
					{
						sleep(creep,thisRoom)
					}
					break;
				}
				case 'spawnNanny':
				{
					let target = ""
					let thisSpawn = Game.getObjectById(thisRoom.spawns[0].id)
					if(thisSpawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
					{
						target = thisSpawn;
					}
					else
					{
						let extensions = creep.room.find(FIND_MY_STRUCTURES,
						{
							filter: (structure) =>
							{
								return (structure.structureType == STRUCTURE_EXTENSION ) &&
								structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
						}
						});
						target = creep.pos.findClosestByPath(extensions);
					}

					if(target != null)
					{
						if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
						{
							creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
							creep.say('🔄 Flng');
						}
					}		
					break;
				}
				case 'truck':
				{
					deliverEnergy(creep, thisRoom);
					break;
				}
				case 'upgrader':
				{
					if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
					{
						creep.say('Upg')
						creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
					}
					break;
				}
			}
		}
	}
	
	let myRoom = Memory.rooms.find(element => element.name == creep.room.name);
	switch(true)
	{
		case (creep.memory.worker == true && creep.store[RESOURCE_ENERGY] == 0)://WereEmpty
		{
			creep.memory.primed = false;
			break;
		}
		case (creep.memory.worker == true && creep.store.getFreeCapacity() == 0)://WereFull
		{
			creep.memory.primed = true;
			break;
		}
		default:
		{
			creep.memory.worker = true
			break;
		}
	}
	//We Know if we need Energy or Not
	if (creep.ticksToLive > 1000 && creep.memory.action == 'renew')
	{
		creep.memory.action = 'work';
	}
	
	if((creep.ticksToLive > 200 && creep.memory.action !='renew') || (creep.memory.role == 'harvester' || creep.memory.role == 'upgrader'))
	{
		switch(true)
		{
			case (creep.memory.primed == true && creep.memory.role == 'harvester'):
			{//Its a harvester and is primed so we want to drop that energy
				creep.memory.action = 'placeEnergy';
				break;
			}
			case (!creep.memory.primed && creep.memory.role == 'harvester'):
			{//Its a harvester and is NOT primed so we want to gather that energy
				creep.memory.action = 'harvest'
				break;
			}
			case (!creep.memory.primed && creep.memory.role == 'truck'):
			{//Its a harvester and is NOT primed so we want to gather that energy
				creep.memory.action = 'pullFromStorage'
				break;
			}
			case (creep.memory.primed && creep.memory.role != 'harvester'):
			{//Its some other worker and is primed so it needs to get to work
				creep.memory.action = 'work'
				break;
			}
			case (!creep.memory.primed && creep.memory.role != 'harvester'):
			{//Its some other worker and is not primed so it needs to get energy
				if(myRoom.phase < 5)
				{
					creep.memory.action = 'harvest'
				}
				else
				{
					creep.memory.action = 'findEnergy'
				}
				break;
			}
		}
	}		
	else 
	{
		//we need to get renewed
		creep.memory.action = 'renew';
	}
	
		//Act on instructions
		switch(creep.memory.action)
		{
			case 'deliverEnergy':
			{
				deliverEnergy(creep, myRoom);
				break;
			}
			case 'pullFromStorage':
			{
				pullFromStorage(creep, myRoom);
				break;
			}
			case 'placeEnergy':
			{
				placeEnergy(creep, myRoom);
				break;
			}
			case 'findEnergy':
			{
				findEnergy(creep, myRoom);
				break;
			}
			case 'harvest':
			{
				harvest(creep, myRoom);
				break;
			}
			case 'renew':
			{
				renew(creep, myRoom);
				break;
			}
			case 'work':
			{
				work(creep, myRoom);
				break;
			}
		}
	}
};

module.exports = roleGlobal;
