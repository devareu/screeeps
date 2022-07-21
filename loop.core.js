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
					harvesterCount = 2;
					upgraderCount = 1;
					builderCount = 3;
					roadMaintCount = 1;
					truckCount = 0;
					spawnNannyCount = 0;
					break;
				}
				case 1:
				case 2:
				{
					harvesterCount = 2;
					upgraderCount = 1;
					builderCount = 3;
					roadMaintCount = 1;
					truckCount = 0;
					spawnNannyCount = 0;
					break;
				}
				case 3:
				case 4:
				{
					harvesterCount = 2;
					upgraderCount = 2;
					builderCount = 2;
					roadMaintCount = 1;
					truckCount = 0;
					spawnNannyCount = 0;
					harvesterBuild = [WORK,WORK,CARRY,MOVE]
					break;
				}
				case 5:
				case 6:
				case 7:
				case 8:
				case 9:
				case 10:
				{					
					harvesterCount = 4;
					harvesterBuild = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
					upgraderCount = 3;
					upgraderBuild = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
					builderCount = 2;
					builderBuild = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
					roadMaintCount = 3;
					truckCount = 1;
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
				var weight = 1
				if(newName.charAt(newName.length - 1) % 2 == 0)
				{
					weight = 0
				}
				if(Game.spawns[roomName].spawnCreep(harvesterBuild, newName,{memory: {role: 'harvester', weight: weight, worker: true, room: roomName}}) == ERR_NOT_ENOUGH_ENERGY)
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
				if(newName.charAt(newName.length - 1) % 3 == 0)
				{
					weight = 0
				}
				else
				{
					weight = newName.charAt(newName.length - 1) % 3
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
			for(var name in Game.creeps)
			{
				var creep = Game.creeps[name];

				roleGlobal.run(creep);
			}
		}
	},

	jobManagement: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var roomJobs = myRoom.jobs
		let thisRoom = Game.rooms[roomName];
		
		let repairTargets = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => (structure.hits < structure.hitsMax)});
		
		let constructionTargets = thisRoom.find(FIND_MY_CONSTRUCTION_SITES);
		
		let deliveryTargets = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_EXTENSION) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)});

		for(repairTarget in repairTargets)
		{
			var applicableJobs = _.filter(roomJobs, (job) => job.id == repairTargets[repairTarget].id && job.action == 'repair');
			if(applicableJobs.length < 1)
			{//Make sure we have enough engaged
			}
			else
			{//create the job
				var newJob = {}
				newJob.id = repairTargets[repairTarget].id
				newJob.action = 'repair'
				newJob.amount = repairTargets[repairTarget].hitsMax - repairTargets[repairTarget].hits
				newJob.assigned = []
				roomJobs.push(newJob);
			}
			
		}
		
		for(deliveryTarget in deliveryTargets)
		{
			var applicableJobs = _.filter(roomJobs, (job) => job.id == deliveryTargets[deliveryTarget].id && job.action == 'repair');
			if(applicableJobs.length < 1)
			{//Make sure we have enough engaged
			}
			else
			{//create the job
				var newJob = {}
				newJob.id = deliveryTargets[deliveryTarget].id
				newJob.action = 'delivery'
				newJob.amount = deliveryTargets[deliveryTarget].hitsMax - deliveryTargets[deliveryTarget].hits
				newJob.assigned = []
				roomJobs.push(newJob);
			}
			
		}
		
		for(constructionTarget in constructionTargets)
		{
			var applicableJobs = _.filter(roomJobs, (job) => job.id == constructionTargets[constructionTarget].id && job.action == 'repair');
			if(applicableJobs.length < 1)
			{//Make sure we have enough engaged
			}
			else
			{//create the job
				var newJob = {}
				newJob.id = constructionTargets[constructionTarget].id
				newJob.action = 'construction'
				newJob.amount = constructionTargets[constructionTarget].hitsMax - constructionTargets[constructionTarget].hits
				newJob.assigned = []
				roomJobs.push(newJob);
			}
			
		}
		
		for(job in Memory.jobs)
		{
			//check the amount matches the number lf assigned
			if (Memory.jobs[job].assigned.length < 1)
			{//unassigned
				
			}
			else
			{
				
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
			Game.getObjectById(nearestTower[0].structure.id).repair(rampart)			
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

		var myRoom = Memory.rooms.find(element => element.name == roomName);
		let thisRoom = Game.rooms[roomName];
		if(roomName == 'W8N3')
		{
			let enemies = thisRoom.find(FIND_HOSTILE_CREEPS)
			let damagedRamparts = _.filter(thisRoom.find(FIND_MY_STRUCTURES), (struct) => struct.structureType == STRUCTURE_RAMPART && struct.hits < rampartMinHealth);

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
				let thisController = Game.rooms[roomName].find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTROLLER }})[0]
				if(thisController.my)
				{
					Game.spawns['W8N3'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],'claimer'+Game.time,{memory: {role:'claimer', room: roomName}})
				}
				else
				{
					
				}
			}
			else
			{
				Game.spawns['W8N3'].spawnCreep([CLAIM,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],'claimer'+Game.time,{memory: {role:'claimer', room: roomName}})
			}
		}
		if(_.filter(Game.creeps, (creep) => creep.room.name == roomName).length > 0 && Game.spawns[roomName] !== undefined)
		{
			loopMemoryManagement.add(roomName);
		}
		if(_.filter(Memory.rooms, (room) => room.name == roomName).length > 0)
		{
			Game.flags.expand.remove()
		}
	},

	linkManagement: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		let thisRoom = Game.rooms[roomName];
		
		if(myRoom.phase >= 7)
		{
			let controllerLink = Game.getObjectById(myRoom.controller.store)
			let spawnLink = Game.getObjectById(myRoom.spawns[0].link)
			let controllerHandled = 0
			let spawnHandled = 0
			
			for(srcLnk in myRoom.sources)
			{
				let sourceLink = Game.getObjectById(myRoom.sources[srcLnk].link)
				if((spawnLink.energy < 400 || spawnLink.energy === undefined) && spawnHandled == 0)
				{
					sourceLink.transferEnergy(spawnLink)
					spawnHandled = 1
				}
				else if(controllerLink.energy < 500 && controllerHandled == 0)
				{
					sourceLink.transferEnergy(controllerLink)
					controllerHandled = 1
				}
			}
		}		
	}

};

module.exports = loopCore;
