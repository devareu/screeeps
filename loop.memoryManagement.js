var funcBuildOrders = require('func.buildOrders');
var loopMemoryManagement =
{
  start: function(currentRoom)
  {
      if(Memory.rooms.length != null && Memory.rooms.length > 0)
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
		if(buildList.length < 1)
		{
			funcBuildOrders.buildExtensions(thisRoom.name)
			console.log("Ready For Stage 7")		
		}
		else
		{
			console.log("Not Ready For Stage 7")
		}
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
    }
  }
  else
  {
        let startingRoom = Object.keys(Game.spawns)[0]
        let room = Game.rooms[startingRoom]
        Memory.rooms = []
        let memRooms = Memory.rooms
        var newRoom = {}
        newRoom.name = startingRoom
        
        //Get CenterPoint of Room for CitySquare
        var xSum = 0;
        var xCount = 0;
        var ySum = 0;
        var yCount = 0;
        //Find Spawns and Put it in
        newRoom.spawns = []
        var newSpawn = {}
        newSpawn.id = Game.spawns[startingRoom].id
        newSpawn.pos = Game.spawns[startingRoom].pos
        newRoom.spawns.push(newSpawn)
          xSum += Game.spawns[startingRoom].pos.x
          xCount++
          ySum += Game.spawns[startingRoom].pos.y
          yCount++
        //Find Controller and Put it in
        newRoom.controller = {}
        newRoom.controller.id = room.controller.id
        newRoom.controller.pos = room.controller.pos
        //Get CenterPoint of Room for CitySquare
         xSum = newRoom.controller.pos.x;
         xCount++;
         ySum = newRoom.controller.pos.y;
         yCount++;
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
          xSum += roomSources[roomSource].pos.x
          xCount++
          ySum += roomSources[roomSource].pos.y
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
  }
  }
};

module.exports = loopMemoryManagement;
