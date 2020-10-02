using Hive.Domain.Entities;
using FluentAssertions;
using Xunit;

namespace Hive.Domain.Tests
{
    public class CreaturesTests
    {
        [Fact]
        public void CanCreateQueen()
        {
            var queen = Creatures.Queen;
            queen.Name.Should().Be("Queen");
        }
    }
}