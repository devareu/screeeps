var funcBuildOrders = require('func.buildOrders');
var loopMemoryManagement =
{
  start: function(currentRoom)
  {
    var thisRoom = Game.rooms[Object.keys(Game.spawns)[0]]
	var myRoom = Memory.rooms.find(element => element.name == currentRoom);
    let buildList = thisRoom.find(FIND_CONSTRUCTION_SITES)
    switch(myRoom.phase)
    {
      case 0://we have room info and locations, build road to Source from Spawn
      {
        funcBuildOrders.buildCenterToSpawn(thisRoom.name)
        myRoom.phase = 1
        console.log("Ready For Stage 1")
        break;
      }
      case 1://we have road to Source from Spawn, create road from Source to Controller
      {
        if(buildList.length < 1)
        {
          funcBuildOrders.buildCenterToController(thisRoom.name)
          myRoom.phase = 2
          console.log("Ready For Stage 2")
        }
        else
        {
          console.log("Not Ready For Stage 2")
        }
        break;
      }
      case 2://we have road to controller from sources
      {
        if(buildList.length < 1)
        {
          funcBuildOrders.buildCenterToController(thisRoom.name)
          myRoom.phase = 3
          console.log("Ready For Stage 3")
        }
        else
        {
          console.log("Not Ready For Stage 3")
        }
        break;
      }
      case 3:// Build Storage
      {
		if(buildList.length < 1)
        {
		  var myRoom = Memory.rooms.find(element => element.name == thisRoom.name);
          let storageId = funcBuildOrders.buildSourceStorage(thisRoom.name)
		  myRoom.sourceStore = storageId
          myRoom.phase = 4
          console.log("Ready For Stage 4")
        }
        else
        {
          console.log("Not Ready For Stage 4")
        }
        break;
      }
      case 4://Check point for Storage Completed
	  {
		if(buildList.length < 1)
        {
			myRoom.phase = 5
			console.log("Ready For Stage 4")		
		}
		else
		{
          console.log("Not Ready For Stage 5")
		}
		  break;
	  }
      case 5://Build Upgrager Container
	  {
		let containerId = funcBuildOrders.buildUpgraderContainer(thisRoom.name)
		if(containerId != 'Single Sources Unhandled')
		{
			var myRoom = Memory.rooms.find(element => element.name == thisRoom.name);
			myRoom.controllerContainer = containerId
			myRoom.phase = 6
			console.log("Ready For Stage 6")
			break;
		}
		else
		{
			console.log("Not Ready For Stage 6:Single Sources Unhandled")
			break;
		}
	  }
      case 6://Build Spawn Container
	  {
		let containerId = funcBuildOrders.buildSpawnContainer(thisRoom.name)
		var myRoom = Memory.rooms.find(element => element.name == thisRoom.name);
		myRoom.spawnContainer = containerId
		myRoom.phase = 7
		console.log("Ready For Stage 7")
		break;
	  }
      case 7:
	  {
		  //Build
		  break;
	  }
      case 8:
      case 9:
      case 10:
	  {
		if(buildList.length < 1)
        {
			console.log('7> Not Implemented')	
		}
		else
		{
          console.log("Not Ready For Stage 6")
		}
		break;
	  }
	  default://essentially the first pass
      {
        let startingRoom = Object.keys(Game.spawns)[0]
        let room = Game.rooms[startingRoom]
        Memory.rooms = []
        let memRooms = Memory.rooms
        var newRoom = {}
        newRoom.name = startingRoom
        //Find Spawns and Put it in
        newRoom.spawns = []
        newSpawn = {}
        newSpawn.id = Game.spawns[startingRoom].id
        newSpawn.pos = Game.spawns[startingRoom].pos
        newRoom.spawns.push(newSpawn)
        //Find Controller and Put it in
        newRoom.controller = {}
        newRoom.controller.id = room.controller.id
        newRoom.controller.pos = room.controller.pos
        //Find Sources and Put them in
        let roomSources = _.map(room.find(FIND_SOURCES), function(source){return {id: source.id, pos: source.pos};});
        newRoom.sources = []
        for(var roomSource in roomSources)
        {
          var newSource = {}
          console.log(roomSource)
          newSource.id = roomSources[roomSource].id
          newSource.pos = roomSources[roomSource].pos
          newRoom.sources.push(newSource)
        }
        //Get CenterPoint of Room for CitySquare
        var xSum = newRoom.controller.pos.x;
        var xCount = 1;
        var ySum = newRoom.controller.pos.y;
        var yCount = 1;
        for(source in newRoom.sources)
        {
          xSum += newRoom.sources[source].pos.x
          xCount++
          ySum += newRoom.sources[source].pos.y
          yCount++
        }
        for(spawn in newRoom.spawns)
        {
          xSum += newRoom.spawns[spawn].pos.x
          xCount++
          ySum += newRoom.spawns[spawn].pos.y
          yCount++
        }
        newRoom.cityCenter = {}
        newRoom.cityCenter.pos = {}
        newRoom.cityCenter.pos.x = Math.round(xSum / xCount)
        newRoom.cityCenter.pos.y = Math.round(ySum / yCount)
        newRoom.cityCenter.pos.roomName = startingRoom
        memRooms.push(newRoom)
        myRoom.phase = 0
        console.log("Ready For Stage 1")
        break;
      }
    }
  }
};

module.exports = loopMemoryManagement;
