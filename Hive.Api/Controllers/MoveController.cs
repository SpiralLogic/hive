﻿using System;
 using System.Collections.Generic;
 using System.Drawing;
 using System.Linq;
 using System.Reflection;
 using Hive.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Hive.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MoveController : ControllerBase
    {
        private readonly ILogger<MoveController> _logger;

        public MoveController(ILogger<MoveController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Produces("application/json")]
        public GameState Post()
        {
            var set = new JsonSerializerSettings
            {
                ContractResolver = new ImmutableContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy(),
                    
                },
                Formatting = Formatting.Indented
            };
            
            var gameState = JsonConvert.DeserializeObject<GameState>(HttpContext.Session.GetString("game"), set);

            gameState.Cells.Add(new Cell(new GameCoordinate(1, 2)));
            gameState.Cells.Add(new Cell(new GameCoordinate(2, 2)));
            gameState.Cells.Add(new Cell(new GameCoordinate(1, 1)));
            gameState.Cells.First().Tiles.Add(gameState.Players.First().AvailableTiles.First());

            var json = JsonConvert.SerializeObject(gameState, set);
            HttpContext.Session.SetString("game", json);
            return gameState;
        }
    }

    public class ImmutableContractResolver : DefaultContractResolver
    {
        protected  override List<MemberInfo> GetSerializableMembers(Type objectType)
        {
            return objectType.GetProperties().Cast<MemberInfo>().ToList();
        }
    }
}