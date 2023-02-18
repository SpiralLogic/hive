import { FunctionComponent } from 'preact';
import type { Creature as CreatureType } from '../domain/creature';

export const Creature: FunctionComponent<{ creature: CreatureType }> = ({ creature }) => (
  <use className="creature" href={`#${creature.toLowerCase()}`} />
);
Creature.displayName = 'Creature';
export default Creature;
