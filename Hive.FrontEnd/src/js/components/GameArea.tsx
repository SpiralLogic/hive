import { CSSProperties } from 'react';
import * as React from 'react';
import { Board } from './Board';
import { PlayerList } from './PlayerList';
import { IEngine } from '../domain';
import { Context, useGameContext } from '../GameContext';


interface IProps {
  engine: IEngine;
}


export const GameArea: React.FunctionComponent<IProps> = ({ engine }) => {
  const [loading, gameContext] = useGameContext(engine);

  if (loading) {
    return <h1>loading</h1>;
  }
  const styles= {'--hex-size': '50px'} as CSSProperties;
  return (
    <div className="game" style={styles}>
      <Context.Provider value={gameContext}>
        <PlayerList/>
        <Board/>     
      </Context.Provider>
    </div>
  );
};
