import '../css/player.css';

import {ComponentChildren, toChildArray} from 'preact';

import {PlayerId} from '../domain';
import {useClassSignal} from '../hooks/useClassSignal';
import {useAnimatedHide} from "../hooks/useAnimatedHide";

type Properties = {
    name: string;
    id: PlayerId;
    children?: ComponentChildren;
};

function Player(props: Properties) {
    const {name, id, children} = props;
    const [classes, classAction] = useClassSignal(`player player${id}`);
    const hasNoChildren = toChildArray(children).length === 0;
    const handlers = useAnimatedHide(hasNoChildren, [classes, classAction]);

    return (
        <section class={classes} aria-label={`${name}'s unplaced pieces`} {...handlers}>
            <h2>{name}</h2>
            <div class="tiles">{children}</div>
        </section>
    );
}

Player.displayName = 'Player Tiles';
export default Player;
