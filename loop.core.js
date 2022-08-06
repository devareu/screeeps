var roleGlobal = require('role.global');
var loopMemoryManagement = require('loop.memoryManagement');
var funcHelpers = require('func.helpers');

var loopCore =
{
	
	creepManagement: function(roomName)
	{		
		function genNewName (roleName)
		{
			var units = _.filter(Game.creeps, (creep) => creep.memory.role == roleName);
			var prefix = ''
			var limit = 0
			var newNumber = 1
			switch(roleName)
			{
				case 'harvester':
				{
					prefix = roomName + '-hvst-'
					limit = harvesterCount
					break;
				}
				case 'upgrader':
				{
					prefix = roomName + '-upgrd-'
					limit = upgraderCount
					break;
				}
				case 'builder':
				{
					prefix = roomName + '-bldr-'
					limit = builderCount
					break;
				}
				case 'roadmaint':
				{
					prefix = roomName + '-rdMnt-'
					limit = roadMaintCount
					break;
				}
				case 'truck':
				{
					prefix = roomName + '-trk-'
					limit = truckCount
					break;
				}
				case 'spawnNanny':
				{
					prefix = roomName + '-spnNny-'
					limit = spawnNannyCount
					break;
				}
				case 'harvestNanny':
				{
					prefix = roomName + '-hvtNny-'
					limit = harvestNannyCount
					break;
				}
			}
			
			var numbers = units.map(function(a) { var test = a.name; return test.replace(prefix,'');})
			for(let intCount = 1; intCount <= limit; intCount++)
			{
				var test = numbers.find(element => element == intCount)
				if(test == null)
				{
					newNumber = intCount
				}
			}
			return prefix.concat(newNumber)
		}
		
		{//Core Variables for Creep Configuration
			var myRoom = Memory.rooms.find(element => element.name == roomName);
			var harvesterCount = 0;	
			if(myRoom.sources[0].harvestersMax > 1)
			{
				harvesterCount = harvesterCount + 2
			}
			else
			{
				harvesterCount = harvesterCount + 1
			}				
			if(myRoom.sources[1])
			{
				if(myRoom.sources[1].harvestersMax > 1)
				{
					harvesterCount = harvesterCount + 2
				}
				else
				{
					harvesterCount = harvesterCount + 1
				}
			}
			var harvesterBuild = [WORK,CARRY,MOVE,MOVE]
			var upgraderCount = 0;
			var upgraderBuild = [WORK,CARRY,MOVE,MOVE]
			var builderCount = 0;
			var builderBuild = [WORK,CARRY,MOVE,MOVE]
			var roadMaintCount = 0;
			var roadMaintBuild = [WORK,CARRY,MOVE,MOVE]
			var truckCount = 0;
			var truckBuild = [CARRY,CARRY,MOVE,MOVE]
			var spawnNannyCount = 0;
			var spawnNannyBuild = [CARRY,CARRY,CARRY,MOVE]
		}

		{//Phase Based Creep Configuration
			switch(myRoom.phase)
			{
				case 0:
				{
					if(myRoom.sources[0].store && myRoom.sources[1] && myRoom.sources[1].store)
					{
						truckCount = 1;
					}
					else
					{
						truckCount = 0;
					}
						
					upgraderCount = 1;
					builderCount = 3;
					roadMaintCount = 1;
					spawnNannyCount = 0;
					break;
				}
				case 1:
				{
					harvesterBuild = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE];
					upgraderCount = 3;
					builderCount = 3;
					roadMaintCount = 1;
					truckCount = 2;
					spawnNannyCount = 1;
					break;
				}
				case 2:
				{
					harvesterBuild = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE];
					upgraderCount = 3;
					upgraderBuild = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
					builderCount = 2;
					roadMaintCount = 1;
					truckCount = 2;
					truckBuild = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
					spawnNannyCount = 1;
					spawnNannyBuild = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
					break;
				}
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
				case 9:
				case 10:
				{
					harvesterBuild = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
					upgraderCount = 3;
					upgraderBuild = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
					builderCount = 2;
					builderBuild = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
					roadMaintCount = 2;
					truckCount = 2;
					truckBuild = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
					spawnNannyCount = 1;
					spawnNannyBuild = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
					break;
				}
			}
		}
		
		{//Clean Up Missing Creeps
			for(var name in Memory.creeps)
			{
				if(!Game.creeps[name])
				{
					delete Memory.creeps[name];
				}
			}
		}
		
		{//Get Creep Counts
			var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.room == roomName);
			var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.room == roomName);
			var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.room == roomName);
			var roadMaintainers = _.filter(Game.creeps, (creep) => creep.memory.role == 'roadmaint' && creep.memory.room == roomName);
			var trucks = _.filter(Game.creeps, (creep) => creep.memory.role == 'truck' && creep.memory.room == roomName);
			var spawnNannys = _.filter(Game.creeps, (creep) => creep.memory.role == 'spawnNanny' && creep.memory.room == roomName);
		}
		
		{//Handle Spawning Creeps
			if(harvesters.length < harvesterCount)
			{
				var newName = genNewName('harvester');
				let hrvZeroCount = _.filter(harvesters, (hrv) => hrv.memory.weight == 0).length
				let hrvZeroMax = myRoom.sources[0].harvestersMax
				if(hrvZeroMax > 2){ hrvZeroMax = 2}
				var weight = 0
				
				if(myRoom.sources[1])
				{
					let hrvOneCount = _.filter(harvesters, (hrv) => hrv.memory.weight == 1).length
					let hrvOneMax = myRoom.sources[1].harvestersMax
					if(hrvOneMax > 2)
					{
						hrvOneMax = 2
					}
					if((hrvZeroCount > hrvOneCount || hrvZeroCount == hrvZeroMax) && hrvOneCount < hrvOneMax)
					{
						weight = 1
					}
				}
				if((Game.spawns[roomName].spawnCreep(harvesterBuild, newName,{memory: {role: 'harvester', weight: weight, worker: true, room: roomName}}) == ERR_NOT_ENOUGH_ENERGY) && harvesters.length < 3)
				{
					Game.spawns[roomName].spawnCreep([WORK,CARRY,MOVE,MOVE], newName,{memory: {role: 'harvester', weight: weight, worker: true, room: roomName}})
				}
			}			
			else if(spawnNannys.length < spawnNannyCount)
			{
				
				var newName = genNewName('spawnNanny');
				var weight = 1
				if(newName.charAt(newName.length - 1) % 2 == 0)
				{
					weight = 0
				}
				Game.spawns[roomName].spawnCreep(spawnNannyBuild, newName, {memory: {role: 'spawnNanny',weight:weight,worker:true, room: roomName}});
			}
			
			else if(trucks.length < truckCount)
			{
				var newName = genNewName('truck');
				var weight = 1
				if(newName.charAt(newName.length - 1) % 2 == 0)
				{
					weight = 0
				}
				Game.spawns[roomName].spawnCreep(truckBuild, newName, {memory: {role: 'truck',weight:weight,worker:true, room: roomName}});
			}
			
			else if(builders.length < builderCount)
			{
				var newName = genNewName('builder');
				var weight = 1
				if(newName.charAt(newName.length - 1) % 2 == 0)
				{
					weight = 0
				}
				Game.spawns[roomName].spawnCreep(builderBuild, newName,{memory: {role: 'builder',weight:weight,worker:true, room: roomName}});
			}
			
			else if(roadMaintainers.length < roadMaintCount)
			{
				var newName = genNewName('roadmaint');
				var weight = 1
				if(newName.charAt(newName.length - 1) % 2 == 0)
				{
					weight = 0
				}
				Game.spawns[roomName].spawnCreep(roadMaintBuild, newName, {memory: {role: 'roadmaint',weight:weight,worker:true, room: roomName}});
			}
			
			else if(upgrader.length < upgraderCount)
			{
				var newName = genNewName('upgrader');
				var weight = 1
				if(newName.charAt(newName.length - 1) % 2 == 0)
				{
					weight = 0
				}
				Game.spawns[roomName].spawnCreep(upgraderBuild, newName, {memory: {role: 'upgrader',weight:weight,worker:true, room: roomName}});
			}
			



			
		}
		
		{//Handle DeSpawning Creeps
			if(harvesters.length > harvesterCount)
			{

			}
			else if(upgrader.length > upgraderCount)
			{
				
			}
			else if(builders.length > builderCount)
			{
				
			}
			else if(roadMaintainers.length > roadMaintCount)
			{
				
			}
			else if(trucks.length > truckCount)
			{

			}
			else if(spawnNannys.length > spawnNannyCount)
			{

			}
		}
			
		{//Report Spawn Activity
			if(Game.spawns[roomName].spawning)
			{
			  var spawningCreep = Game.creeps[Game.spawns[roomName].spawning.name];
			  Game.spawns[roomName].room.visual.text('🛠️' + spawningCreep.memory.role,Game.spawns[roomName].pos.x + 1,Game.spawns[roomName].pos.y,{align: 'left', opacity: 0.8});
			}
		}
		
		{//Give Creeps Their Roles
		 let roomCreeps = _.filter(Game.creeps, (cr) => cr.memory.room == roomName);
			for(var name in roomCreeps)
			{
				var creep = roomCreeps[name];
				switch(creep.memory.role)
				{
					case 'harvester':
					{
						if(JSON.stringify(creep.body.map(a => a.type)) != JSON.stringify(harvesterBuild))
						{
							creep.memory.replace = 1
							
						}
						else
						{
							creep.memory.replace = 0
						}
						break;
					}
					case 'upgrader':
					{
						if(JSON.stringify(creep.body.map(a => a.type)) != JSON.stringify(upgraderBuild))
						{
							creep.memory.replace = 1
						}
						else
						{
							creep.memory.replace = 0
						}
						break;
					}
					case 'builder':	
					{
						if(JSON.stringify(creep.body.map(a => a.type)) != JSON.stringify(builderBuild))
						{
							creep.memory.replace = 1
						}
						else
						{
							creep.memory.replace = 0
						}
						break;
					}
					case 'roadMaint':	
					{
						if(JSON.stringify(creep.body.map(a => a.type)) != JSON.stringify(roadMaintBuild))
						{
							creep.memory.replace = 1
						}
						else
						{
							creep.memory.replace = 0
						}
						break;
					}
					case 'truck':	
					{
						if(JSON.stringify(creep.body.map(a => a.type)) != JSON.stringify(truckBuild))
						{
							creep.memory.replace = 1
						}
						else
						{
							creep.memory.replace = 0
						}
						break;
					}
					case 'spawnNanny':
					{
						if(JSON.stringify(creep.body.map(a => a.type)) != JSON.stringify(spawnNannyBuild))
						{
							creep.memory.replace = 1
						}
						else
						{
							creep.memory.replace = 0
						}
						break;
					}
					
				}
				roleGlobal.run(creep);
			}
		}
	},

	jobManagement: function(roomName)
	{
		let wallMinHealth = 5000
		let rampartMinHealth = 2500
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		let thisRoom = Game.rooms[roomName];
		var roomJobs = myRoom.jobs
		var newJobs = []
		var existingJobs = []
		
		let repairTargets = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => 
		(
			(//Not at full health, ignore ramparts and walls
				structure.hits < structure.hitsMax
				&& structure.structureType != STRUCTURE_RAMPART
				&& structure.structureType != STRUCTURE_WALL
			)
			||
			(//Walls
				structure.hits < wallMinHealth
				&& structure.structureType == STRUCTURE_WALL								
			)								
			||
			(//Ramparts
				structure.hits < rampartMinHealth
				&& structure.structureType == STRUCTURE_RAMPART
			)
		)});
		let constructionTargets = thisRoom.find(FIND_MY_CONSTRUCTION_SITES);
		let deliveryTargets = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_EXTENSION) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)});

		for(repairTarget in repairTargets)
		{
			var newJob = {}
			newJob.id = repairTargets[repairTarget].id
			newJob.action = 'repair'
			newJob.amount = repairTargets[repairTarget].hitsMax - repairTargets[repairTarget].hits
			newJob.assigned = []
			
			var applicableJobs = _.filter(roomJobs, (job) => 
				job.id == repairTargets[repairTarget].id 
				&& job.action == 'repair');
			if(applicableJobs.length != 1)
			{//create the job
				newJobs.push(newJob);
			}
			else
			{
				existingJobs.push(newJob)
			}
		}
		
		for(deliveryTarget in deliveryTargets)
		{
			var newJob = {}
			newJob.id = deliveryTargets[deliveryTarget].id
			newJob.action = 'delivery'
			newJob.amount = deliveryTargets[deliveryTarget].hitsMax - deliveryTargets[deliveryTarget].hits
			newJob.assigned = []
				
			var applicableJobs = _.filter(roomJobs, (job) => 
				job.id == deliveryTargets[deliveryTarget].id 
				&& job.action == 'delivery');
			if(applicableJobs.length != 1)
			{//create the job
				newJobs.push(newJob);
			}
			else
			{
				existingJobs.push(newJob)
			}
		}
		
		for(constructionTarget in constructionTargets)
		{
			var newJob = {}
			newJob.id = constructionTargets[constructionTarget].id
			newJob.action = 'construction'
			newJob.amount = constructionTargets[constructionTarget].hitsMax - constructionTargets[constructionTarget].hits
			newJob.assigned = []
			
			var applicableJobs = _.filter(roomJobs, (job) => 
				job.id == constructionTargets[constructionTarget].id 
				&& job.action == 'construction');
			if(applicableJobs.length != 1)
			{//create the job
				newJobs.push(newJob);
			}
			else
			{
				existingJobs.push(newJob)
			}
		}
		
		myRoom.jobs = newJobs.concat(existingJobs)
		
		//We should now have a current list of actions and their amounts
		for(job in myRoom.jobs)
		{
			if(myRoom.jobs[job].assigned == "")
			{// its unassigned
				//find a bot that fits the needs and isnt assigned
			}
				
		}		
		
	},

	towerManagement: function(roomName)
	{
		let wallMinHealth = 2500
		let rampartMinHealth = 3000

		function repairRampart (rampart)
		{
			var nearestTower =_.filter
			(
				rampart.room.lookForAtArea
				(
					LOOK_STRUCTURES,
					rampart.pos.y-1,
					rampart.pos.x-1,
					rampart.pos.y+1,
					rampart.pos.x+1,
					true
				)
				, 
				(struct) => struct.structure.structureType == STRUCTURE_TOWER 
			);
			if(nearestTower[0])
			{
				Game.getObjectById(nearestTower[0].structure.id).repair(rampart)
			}
		}
		
		function attackCreep (creep)
		{
			let roomTowers = _.filter(thisRoom.find(FIND_MY_STRUCTURES), (struct) => struct.structureType == STRUCTURE_TOWER);
			for(tower in roomTowers)
			{
				if(Memory.killTalakrin == 1 && creep.owner.username == 'Talakrin')
				{
					roomTowers[tower].attack(creep)
				}
				else if(Memory.killKat == 1 && creep.owner.username == 'Kat')
				{
					roomTowers[tower].attack(creep)
				}
				else if (creep.owner.username != 'Talakrin' && creep.owner.username != 'Kat')
				{
					roomTowers[tower].attack(creep)					
				}
			}
		}

		function healCreep (creep)
		{
			var nearestTower = creep.pos.findClosestByPath(_.filter(creep.room.find(FIND_MY_STRUCTURES), (struct) => struct.structureType == STRUCTURE_TOWER && struct.energy && struct.energy > 100));
			nearestTower.heal(creep)
		}
		
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		let thisRoom = Game.rooms[roomName];
		if(thisRoom.find(FIND_MY_STRUCTURES, (struct) => struct.structureType == STRUCTURE_TOWER).length > 0)
		{
			let enemies = thisRoom.find(FIND_HOSTILE_CREEPS)
			let damagedRamparts = _.filter(thisRoom.find(FIND_MY_STRUCTURES), (struct) => struct.structureType == STRUCTURE_RAMPART && struct.hits < rampartMinHealth);
			let hurtCreeps = _.filter(thisRoom.find(FIND_MY_CREEPS), (creep) => creep.hits < creep.hitsMax);

			if(enemies.length > 0)
			{
				myRoom.defcon = 1
			}
			else
			{
				myRoom.defcon = 0
			}
			switch(true)
			{
				case (myRoom.defcon == 0 && damagedRamparts.length > 0):
				{//No Enemies, Ramparts Degraded
					for(dmgRmprt in damagedRamparts)
					{
						repairRampart(damagedRamparts[dmgRmprt])
					}
					break;
				}
				case (myRoom.defcon == 0 && hurtCreeps.length > 0):
				{//No Enemies, Creep Injured
					for(hurtCreep in hurtCreeps)
					{
						healCreep(hurtCreeps[hurtCreep])
					}
					break;
				}
				case (myRoom.defcon == 1 && damagedRamparts.length < 1):
				{//Enemies, Ramparts are solid
					console.log(myRoom.name,'Defcon',myRoom.defcon, enemies[0].owner.username)
					for(enemy in enemies)
					{
						attackCreep(enemies[enemy])
					}
					break;
				}
				case (myRoom.defcon == 0 && damagedRamparts.length < 1):
				{//No Enemies, Ramparts are solid
					break;
				}

				case (myRoom.defcon == 1 && damagedRamparts.length > 0):
				{//No Enemies, Ramparts are solid
					for(dmgRmprt in damagedRamparts)
					{
						repairRampart(damagedRamparts[dmgRmprt])
					}
					for(enemy in enemies)
					{
						attackCreep(enemies[enemy])
					}
					break;
				}
			}
			
		}
	},

	expansionManagement: function(roomName)
	{
		console.log('Expanding to ',roomName)
		if(_.filter(Game.creeps,(creep) => creep.memory.role == 'claimer').length < 4)
		{
			if(Game.rooms[roomName])
			{
				let thisController = Game.rooms[roomName].controller
				if(thisController.my)
				{
					Game.spawns['W8N3'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],'claimer'+Game.time,{memory: {role:'claimer', room: roomName}})
				}
				else
				{
					Game.spawns['W8N3'].spawnCreep([CLAIM,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],'claimer'+Game.time,{memory: {role:'claimer', room: roomName}})
				}
			}
			else
			{
				Game.spawns['W8N3'].spawnCreep([CLAIM,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],'claimer'+Game.time,{memory: {role:'claimer', room: roomName}})
			}
		}
		if(_.filter(Game.creeps, (creep) => creep.room.name == roomName).length > 0 && Game.spawns[roomName] !== undefined && Game.rooms[roomName].controller.my)
		{
			loopMemoryManagement.add(roomName);
		}
		if(_.filter(Memory.rooms, (room) => room.name == roomName).length > 0)
		{
			//Game.flags.expand.remove()
		}
	},

	linkManagement: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		let thisRoom = Game.rooms[roomName];
		
		let controllerLink = Game.getObjectById(myRoom.controller.store)
		let spawnLink = Game.getObjectById(myRoom.spawns[0].link)
		let controllerHandled = 0
		let spawnHandled = 0
		
		if(myRoom.spawns[0].link)
		{
			for(source in myRoom.sources)
			{
				if(myRoom.sources[source].link)
				{
					let sourceLink = Game.getObjectById(myRoom.sources[source].link)
					if((spawnLink.energy < 500 || spawnLink.energy === undefined) && spawnHandled == 0 && sourceLink.energy > 500)
					{//Spawn link is low or empty
						sourceLink.transferEnergy(spawnLink)
						spawnHandled = 1
					}
					else if(controllerLink && (controllerLink.energy < 500 || controllerLink.energy === undefined) && controllerHandled == 0 && sourceLink.energy > 500)
					{//Controller link is low
						sourceLink.transferEnergy(controllerLink)
						controllerHandled = 1
					}
					else if(sourceLink.energy > 750 && myRoom.sources[source].store && Game.getObjectById(myRoom.sources[source].store).store.getFreeCapacity() == 0 && sourceLink.energy > 500)
					{//Source Containers are full and so is link
						sourceLink.transferEnergy(spawnLink)
					}
				}
			}
		}
		if(myRoom.spawns[1] && myRoom.spawns[1].link)
		{
			let sourceLink = Game.getObjectById(myRoom.sources[1].link)
			if((controllerLink.energy < 500 || controllerLink.energy === undefined) && controllerHandled == 0)
			{//Controller link is low
				sourceLink.transferEnergy(controllerLink)
				controllerHandled = 1
			}
			else if((spawnLink.energy < 400 || spawnLink.energy === undefined) && spawnHandled == 0)
			{//Spawn link is low or empty
				sourceLink.transferEnergy(spawnLink)
				spawnHandled = 1
			}
			else if(sourceLink.energy > 750 && Game.getObjectById(myRoom.sources[1].store).store.getFreeCapacity() == 0)
			{//Source Containers are full and so is link
				sourceLink.transferEnergy(spawnLink)
			}
		}
	},
	
	dataManagement: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		let thisRoom = Game.rooms[roomName];
		
		if(!myRoom.reportData)
		{
			myRoom.reportData = {}
			myRoom.reportData.gclTicks = []
			for (let step = 0; step < 10; step++)
			{
				myRoom.reportData.gclTicks.push(0);
			}
			myRoom.reportData.gclAvg = 0
			myRoom.reportData.gclLastTick = 0
		}
		
		let data = myRoom.reportData
		data.gclTicks[9] = data.gclTicks[8]
		data.gclTicks[8] = data.gclTicks[7]
		data.gclTicks[7] = data.gclTicks[6]
		data.gclTicks[6] = data.gclTicks[5]
		data.gclTicks[5] = data.gclTicks[4]
		data.gclTicks[4] = data.gclTicks[3]
		data.gclTicks[3] = data.gclTicks[2]
		data.gclTicks[2] = data.gclTicks[1]
		data.gclTicks[1] = data.gclTicks[0]
		data.gclTicks[0] = thisRoom.controller.progress
		
		var total = 0;
		for(var i = 0; i < data.gclTicks.length-1; i++)
		{
			total += data.gclTicks[i] - data.gclTicks[i+1];
		}
		data.gclAvg = Math.ceil(total / data.gclTicks.length);
		data.gclLastTick = data.gclTicks[0] - data.gclTicks[1]
	}


};

module.exports = loopCore;
