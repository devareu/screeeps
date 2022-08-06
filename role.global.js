var loopMemoryManagement = require('loop.memoryManagement');
var roleGlobal =
{
	run: function(creep)
	{
		let wallMinHealth = 5000
		let rampartMinHealth = 2500
		{//Creep Action Code
			function deliverEnergy(creep, myRoom)
			{//Truck Logic
				let spawnNannys = _.filter(Game.creeps, (creep) => creep.memory.role == 'spawnNanny' && creep.memory.room == myRoom.name);
				if(!myRoom.sources[0].link && spawnNannys.length == 1)
				{//Towers, Spawn Container to an Extent, Controller Container
					var target
					var targets = _.filter(creep.room.find(FIND_MY_STRUCTURES), (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < 1000);
					if(targets.length > 0)
					{
						target = creep.pos.findClosestByPath(targets);
					}
					else
					{//No towers in need, look for spawns and extensions
						targets = creep.room.find(FIND_MY_STRUCTURES,
						{
							filter: (structure) =>
							{
								return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
								structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
							}
						})
						if(targets.length > 0)
						{
							target = creep.pos.findClosestByPath(targets);
						}
						else
						{//No spawns and extensions in need, Check Controller Container
							
							if(myRoom.controller.store &&((Game.getObjectById(myRoom.controller.store).store && Game.getObjectById(myRoom.controller.store).store.getFreeCapacity(RESOURCE_ENERGY) > 200) || (Game.getObjectById(myRoom.controller.store).energy && Game.getObjectById(myRoom.controller.store).energyCapacity - Game.getObjectById(myRoom.controller.store).energy > 200)))
							{
								target = Game.getObjectById(myRoom.controller.store)
							}
						}	
					}
					
					if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
					{
						creep.moveTo(target, {reusePath: 5}, {visualizePathStyle: {stroke: '#ffffff'}});
						creep.say('🔄 Dlvr');
					}
				}
				else if(myRoom.spawns[0].link && spawnNannys.length == 1)
				{//Towers
					var target
					// Towers >  Link
					var targets = _.filter(creep.room.find(FIND_MY_STRUCTURES), (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < 1000);
						
					if(targets.length > 0)
					{
						target = creep.pos.findClosestByPath(targets);
					}
					if(!target)
					{
						if(myRoom.controller.store)
						{
							let controllerStore = Game.getObjectById(myRoom.controller.store)
							if(controllerStore && controllerStore.store.getFreeCapacity(RESOURCE_ENERGY) > 100)
							{
								target = controllerStore
							}
						}
					}
					
					if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
					{
						creep.moveTo(target, {reusePath: 5}, {visualizePathStyle: {stroke: '#ffffff'}});
						creep.say('🔄 Dlvr');
					}
				}
				else//No Spawn nanny
				{//Towers, Extensions & Spawns, Controller Container, Spawn Container
					var target
					 
					var targets = creep.room.find(FIND_MY_STRUCTURES,
					{
						filter: (structure) =>
						{
							return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
							structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
						}
					})
					if(targets.length > 0)
					{
						target = creep.pos.findClosestByPath(targets);
					}
					else
					{//No spawns and extensions in need, Check Controller Container
						targets = _.filter(creep.room.find(FIND_MY_STRUCTURES), (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < 1000);
						if(targets.length > 0)
						{
							target = creep.pos.findClosestByPath(targets);
						}
						else
						{//No towers in need, look for Controller and Spawn
						
							if(myRoom.controller.store &&((Game.getObjectById(myRoom.controller.store).store && Game.getObjectById(myRoom.controller.store).store.getFreeCapacity(RESOURCE_ENERGY) > 200) || (Game.getObjectById(myRoom.controller.store).energy && Game.getObjectById(myRoom.controller.store).energyCapacity - Game.getObjectById(myRoom.controller.store).energy > 200)))
							{
								target = Game.getObjectById(myRoom.controller.store)
							}
							else
							{// Controller Container is full, check Spawn Container
								if(myRoom.spawnContainer &&((Game.getObjectById(myRoom.spawnContainer).store && Game.getObjectById(myRoom.spawnContainer).store.getFreeCapacity(RESOURCE_ENERGY) > 200) || (Game.getObjectById(myRoom.spawnContainer).energy && Game.getObjectById(myRoom.spawnContainer).energyCapacity - Game.getObjectById(myRoom.spawnContainer).energy > 200)))
								{
									target = Game.getObjectById(myRoom.spawnContainer)
								}
							}
						}
					}
					//Found a target, so lets go to it
					if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
					{
						creep.moveTo(target, {reusePath: 5}, {visualizePathStyle: {stroke: '#ffffff'}});
						creep.say('🔄 Dlvr');
					}
				}
			}
			
			function placeEnergy(creep, myRoom)// Harvestor Logic
			{
				let spawnNannys = _.filter(Game.creeps, (creep) => creep.memory.role == 'spawnNanny' && creep.memory.room == myRoom.name);
				if((myRoom.sources[creep.memory.weight].store || myRoom.sources[creep.memory.weight].link) && spawnNannys.length == 1)
				{
					creep.say('🔄 PlcNrg');
					if(myRoom.sources[creep.memory.weight].link)
					{
						let sourceLink = Game.getObjectById(myRoom.sources[creep.memory.weight].link)
						if(sourceLink.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
						{
							if(creep.transfer(sourceLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
							{
								creep.moveTo(sourceLink,{reusePath: 5}, {visualizePathStyle: {stroke: '#ffffff'}});
							}
						}
						else
						{
							let sourceStore = Game.getObjectById(myRoom.sources[creep.memory.weight].store)
							if(creep.transfer(sourceStore, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
							{
								creep.moveTo(sourceStore,{reusePath: 5}, {visualizePathStyle: {stroke: '#ffffff'}});
							}
						}
					}
					else
					{
						let sourceStore = Game.getObjectById(myRoom.sources[creep.memory.weight].store)
						if(creep.transfer(sourceStore, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
						{
							creep.moveTo(sourceStore,{reusePath: 5}, {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}
				}
				else
				{
					deliverEnergy(creep, myRoom);
				}	
			}
			
			function findEnergy(creep, myRoom)
			{
				var primaryTarget
				switch (creep.memory.role)
				{
					case 'upgrader':
					{//W5N3
						
						if(!myRoom)
						{
							myRoom = _.filter(Memory.rooms, (rm) => rm.name == creep.room.name)[0];
							console.log(JSON.stringify(creep))
							console.log(JSON.stringify(Memory.rooms))
							console.log(JSON.stringify(myRoom))
						}
						if(myRoom && myRoom.controller && myRoom.controller.store && Game.getObjectById(myRoom.controller.store)
							&& (Game.getObjectById(myRoom.controller.store).store.getUsedCapacity() > 0
							|| (Game.getObjectById(myRoom.controller.store).energy && Game.getObjectById(myRoom.controller.store).energy > 0)))
						{
							primaryTarget = Game.getObjectById(myRoom.controller.store)
						}
						else if(myRoom.spawnContainer && Game.getObjectById(myRoom.spawnContainer).store.getUsedCapacity(RESOURCE_ENERGY) > 200)
						{
							primaryTarget = Game.getObjectById(myRoom.spawnContainer)
						}
						else if(myRoom.sources[creep.memory.weight] && myRoom.sources[creep.memory.weight].store && Game.getObjectById(myRoom.sources[creep.memory.weight].store).store.getUsedCapacity(RESOURCE_ENERGY) > 200)
						{
							primaryTarget = Game.getObjectById(myRoom.sources[creep.memory.weight].store)
						}	
						else
						{
							harvest(creep, myRoom)
						}							
						break;
					}
					
					case 'spawnNanny':
					{
						if(myRoom.spawns[0].link)
						{
							primaryTarget = Game.getObjectById(myRoom.spawns[0].link)
							if(!primaryTarget.energy)
							{
								primaryTarget = Game.getObjectById(myRoom.spawnContainer)
							}
						}
						else if(myRoom.spawnContainer && Game.getObjectById(myRoom.spawnContainer).store.getUsedCapacity() > 200)
						{
							primaryTarget = Game.getObjectById(myRoom.spawnContainer)
						}
						else if (Game.getObjectById(myRoom.sources[0].store) && Game.getObjectById(myRoom.sources[0].store).store.getUsedCapacity() > 200)
						{
							primaryTarget = Game.getObjectById(myRoom.sources[0].store)
						}
						else if (myRoom.sources[1])
						{
							primaryTarget = Game.getObjectById(myRoom.sources[1].store)
						}
						break;
					}

					default:
					{
						if(!myRoom)
						{
							console.log(JSON.stringify(creep))
						}
						if(myRoom.spawnContainer && Game.getObjectById(myRoom.spawnContainer).store.getUsedCapacity(RESOURCE_ENERGY) > 0)
						{
							primaryTarget = Game.getObjectById(myRoom.spawnContainer)
						}
						else if(myRoom.spawns[0].store && Game.getObjectById(myRoom.spawns[0].store).store.getUsedCapacity(RESOURCE_ENERGY) > 0)//check spawn container
						{
							primaryTarget = Game.getObjectById(myRoom.spawns[0].store)
						}
						else if(myRoom.spawns[0].link && Game.getObjectById(myRoom.spawns[0].link).energy > 0)//check spawn link
						{
							primaryTarget = Game.getObjectById(myRoom.spawns[0].link)
						}
						else if(myRoom.sources[creep.memory.weight] && myRoom.sources[creep.memory.weight].store && Game.getObjectById(myRoom.sources[creep.memory.weight].store).store.getUsedCapacity(RESOURCE_ENERGY) > 0)//check source weight container
						{
							primaryTarget = Game.getObjectById(myRoom.sources[creep.memory.weight].store)
						}
						else if(myRoom.sources[creep.memory.weight ^ 1] && myRoom.sources[creep.memory.weight ^ 1].store && Game.getObjectById(myRoom.sources[creep.memory.weight ^ 1].store).store.getUsedCapacity(RESOURCE_ENERGY) > 0)//check source weight container
						{
							primaryTarget = Game.getObjectById(myRoom.sources[creep.memory.weight ^ 1].store)
						}
						else if(myRoom.sources[creep.memory.weight] && myRoom.sources[creep.memory.weight].link && Game.getObjectById(myRoom.sources[creep.memory.weight].link).energy > 0)//check source weight link
						{
							primaryTarget = Game.getObjectById(myRoom.sources[creep.memory.weight].link)
						}
						else if(myRoom.sources[creep.memory.weight ^ 1] && myRoom.sources[creep.memory.weight ^ 1].link && Game.getObjectById(myRoom.sources[creep.memory.weight ^ 1].link).energy > 0)//check source weight link
						{
							primaryTarget = Game.getObjectById(myRoom.sources[creep.memory.weight ^ 1].link)
						}
						else
						{
							harvest(creep, myRoom)
						}
						break;
					}
				}
				if(creep.withdraw(primaryTarget,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(primaryTarget,{reusePath: 5}, {visualizePathStyle: {stroke: '#ffaa00'}});
					creep.say('🔄fndNrg');
				}
			}
			
			function harvest(creep, myRoom)
			{
				if(myRoom)
				{
					if(creep.memory.weight == 2)
					{
						creep.memory.weight = 1
					}
					let source = Game.getObjectById(myRoom.sources[creep.memory.weight].id)
					if(source && source.energy > 0)
					{
						if(creep.harvest(source) == ERR_NOT_IN_RANGE)
						{
							creep.moveTo(Game.getObjectById(myRoom.sources[creep.memory.weight].id),{reusePath: 5}, {visualizePathStyle: {stroke: '#ffaa00'}});
							creep.say('🔄 Harvest');
						}
					}
					else if(myRoom.sources[creep.memory.weight].store)
					{
						if(creep.withdraw(Game.getObjectById(myRoom.sources[creep.memory.weight].store), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
						{
							creep.moveTo(Game.getObjectById(myRoom.sources[creep.memory.weight].store),{reusePath: 5}, {visualizePathStyle: {stroke: '#ffaa00'}});
						}
					}
				}
			}
			
			function pullFromStorage(creep, myRoom)
			{
				let sourceStores = []

				for(store in myRoom.sources)
				{
					let sourceStoreEnergy = (Game.getObjectById(myRoom.sources[store].store)).store.getUsedCapacity(RESOURCE_ENERGY)
					sourceStores.push({id: store, energy: sourceStoreEnergy})
				}
				let targetId = sourceStores.sort((a,b) => (b.energy - a.energy))[0].id
				let target = Game.getObjectById(myRoom.sources[targetId].store)
				if(!target.energy)
				{
					target = Game.getObjectById(myRoom.spawnContainer)
				}
				if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(target,{reusePath: 5}, {visualizePathStyle: {stroke: '#ffaa00'}});
					creep.say('🔄 PkStg');
				}
			}
			
			function renew(creep, myRoom)
			{
				let thisSpawn = Game.getObjectById(myRoom.spawns['0'].id)
				if(thisSpawn.renewCreep(creep) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(thisSpawn,{reusePath: 5}, {visualizePathStyle: {stroke: '#ffaa00'}});
					creep.say('🔄 Renew');
				}
			}
			
			function sleep(creep, myRoom)
			{
				creep.moveTo(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y,{reusePath: 5}, {visualizePathStyle: {stroke: '#ffffff'}});
				creep.say('🔄 Sleep');
			}
			
			function work(creep, myRoom)
			{
				switch(creep.memory.role)
				{
					case 'builder':
					{
						var repairTargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => 
							(
								(
									structure.hits < structure.hitsMax
									&& structure.structureType != STRUCTURE_ROAD
									&& structure.structureType != STRUCTURE_RAMPART
									&& structure.structureType != STRUCTURE_WALL
								)
								||
								(
									structure.hits < wallMinHealth
									&& structure.structureType == STRUCTURE_WALL								
								)								
								||
								(
									structure.hits < rampartMinHealth
									&& structure.structureType == STRUCTURE_RAMPART
								)
							)});
						if(repairTargets.length > 0) 
						{
							var target = creep.pos.findClosestByPath(repairTargets);
							if(creep.repair(target) == ERR_NOT_IN_RANGE) 
							{
								creep.say('Rpr')
								creep.moveTo(target,{reusePath: 5, range:3}, {visualizePathStyle: {stroke: '#ffffff'}});
							}
						}
						else
						{
							var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
							if(targets.length > 0)
							{
								var target = creep.pos.findClosestByPath(targets)
								if(creep.build(target) == ERR_NOT_IN_RANGE)
								{
									creep.say('Bld')
									creep.moveTo(target,{reusePath: 5, range:3}, {visualizePathStyle: {stroke: '#ffffff'}});
								}
							}
							else
							{
								sleep(creep,myRoom);
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
						var repairTargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_ROAD)});
						if(repairTargets.length > 0) 
						{
							creep.say('RprRd')
							var target = creep.pos.findClosestByPath(repairTargets);
							if(creep.repair(target) == ERR_NOT_IN_RANGE) 
							{
								creep.moveTo(target,{reusePath: 5, range:3}, {visualizePathStyle: {stroke: '#ffffff'}});
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
									creep.moveTo(targets[0],{reusePath: 5, range:3}, {visualizePathStyle: {stroke: '#ffffff'}});
								}
							}
							else
							{
								sleep(creep,myRoom);
							}
						}
						break;
					}
					case 'spawnNanny':
					{
						let target = ""
						
						let extensions = creep.room.find(FIND_MY_STRUCTURES,
							{
								filter: (structure) =>
								{
									return (structure.structureType == STRUCTURE_EXTENSION ) &&
									structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
							}
							});
						if(extensions.length > 0)
						{
							target = creep.pos.findClosestByPath(extensions);
						}
						else if(Game.getObjectById(myRoom.spawns[0].id).store.getFreeCapacity(RESOURCE_ENERGY) > 0)
						{
							target = Game.getObjectById(myRoom.spawns[0].id);
						}
						else if(myRoom.spawns[1] && Game.getObjectById(myRoom.spawns[1].id).store.getFreeCapacity(RESOURCE_ENERGY) > 0)
						{
							target = Game.getObjectById(myRoom.spawns[1].id);
						}
						else if(myRoom.spawns[2] && Game.getObjectById(myRoom.spawns[2].id).store.getFreeCapacity(RESOURCE_ENERGY) > 0)
						{
							target = Game.getObjectById(myRoom.spawns[2].id);
						}
						else if (myRoom.spawns[0] 
							&& myRoom.spawns[0].store 
							&& Game.getObjectById(myRoom.spawns[0].store).store.getFreeCapacity(RESOURCE_ENERGY) > 0 
							&& myRoom.spawns[0].link
							&& Game.getObjectById(myRoom.spawns[0].link).energy > 600 )
						{
							target = Game.getObjectById(myRoom.spawns[0].store)
						}
						else if(myRoom.spawnContainer
							&& Game.getObjectById(myRoom.spawnContainer).store.getUsedCapacity(RESOURCE_ENERGY) < 750000 
							&& myRoom.spawns[0].link
							&& Game.getObjectById(myRoom.spawns[0].link).energy > 500 )
						{
							target = Game.getObjectById(myRoom.spawnContainer)
						}

						if(target != null)
						{
							if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
							{
								creep.moveTo(target,{reusePath: 5}, {visualizePathStyle: {stroke: '#ffffff'}});
								creep.say('🔄 Flng');
							}
						}
						else
						{
							sleep(creep,myRoom);
						}
							
						break;
					}
					case 'truck':
					{
						deliverEnergy(creep, myRoom);
						break;
					}
					case 'upgrader':
					{
						if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
						{
							creep.say('Upg')
							creep.moveTo(creep.room.controller,{reusePath: 5, range:3}, {visualizePathStyle: {stroke: '#ffffff'}});
						}
						break;
					}
				}
			}
			
		}
		let myRoom = _.filter(Memory.rooms, (rm) => rm.name == creep.memory.room)[0];
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
		
		if
		(
			(
				creep.ticksToLive > 200 
				&& creep.memory.action !='renew'
			)
			||
			(
				creep.memory.role == 'harvester' 
				|| creep.memory.role == 'upgrader' 
				|| creep.memory.role == 'harvestNanny'
				|| creep.memory.role == 'claimer'
			)
		)
		{
			switch(true)
			{
				case (creep.memory.role == 'claimer'):
				{
					if(creep.room.name == creep.memory.room && creep.pos.x != 0 && creep.pos.y != 0)
					{
						let thisController = Game.rooms[creep.room.name].controller
						if(thisController.my)
						{
							if(creep.memory.primed)
							{
								let site = Game.rooms[creep.room.name].find(FIND_MY_CONSTRUCTION_SITES)[0]
								if(site)
								{
									if(creep.build(site) == ERR_NOT_IN_RANGE)
									{
										creep.moveTo(site,{reusePath: 5, range:3}, {visualizePathStyle: {stroke: '#ffffff'}});
									}
								}
								else if(creep.upgradeController(thisController) == ERR_NOT_IN_RANGE)
								{
									creep.say('Upg')
									creep.moveTo(thisController,{reusePath: 5, range:3}, {visualizePathStyle: {stroke: '#ffffff'}});
								}
							}
							else
							{
								sources = Game.rooms[creep.memory.room].find(FIND_SOURCES)
								let target = creep.pos.findClosestByPath(sources)
								if(creep.harvest(target) == ERR_NOT_IN_RANGE)
								{									
									creep.say('Hvst')
									creep.moveTo(target,{reusePath: 5}, {visualizePathStyle: {stroke: '#ffffff'}});
								}
							}
						}
						else
						{
								creep.claimController(thisController)
								creep.moveTo(thisController.pos,{reusePath: 5});
						}							
					}
					else
					{
						const newPos = new RoomPosition(25,25,creep.memory.room);
						creep.moveTo(newPos,{reusePath: 25}, {reusePath: 5})
					}

					break;
				}
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
					creep.memory.action = 'findEnergy'
					break;
				}
				case (creep.memory.primed && creep.memory.role != 'harvester'):
				{//Its some other worker and is primed so it needs to get to work
					creep.memory.action = 'work'
					break;
				}
				case (!creep.memory.primed && creep.memory.role != 'harvester'):
				{//Its some other worker and is not primed so it needs to get energy
					creep.memory.action = 'findEnergy'
					break;
				}
			}
		}		
		else 
		{
			//we need to get renewed
			if(creep.memory.replace == 0)
			{
				creep.memory.action = 'renew';
			}
			else
			{
				creep.memory.action = 'work';
			}
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
