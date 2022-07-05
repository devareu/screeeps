var funcAddRoom = {

    run: function(thisName) {
      function checkName(nme){
        return name == nme;
      }
      var myRoom = Memory.rooms.find(checkName)
      if (myRoom == null)
      {
        var thisRoomSpawn = Game.spawn
        var myRoom =
        {
          name: thisName,
          spawn: "Doe",
          sources: {},
          controller: ""
        };

        Memory.rooms.push(myRoom)
      }
    }
};
module.exports = funcAddRoom;
