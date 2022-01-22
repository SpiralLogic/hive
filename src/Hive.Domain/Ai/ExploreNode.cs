using Hive.Domain.Ai.Heuristics;

namespace Hive.Domain.Ai;

internal sealed record ExploreNode(int Score, HeuristicValues Values);
