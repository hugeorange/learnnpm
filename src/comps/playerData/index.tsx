/**
 * 赛后贴-球员数据
 */

import React from 'react';
import List from '../listComps/index'
import './index.less'


const PlayerData = (props) => {
    const { data, title } = props;
    
    if (!data.start) return null;

    const teamName = data.teamName
    const teamColor = data.teamColor

    data.start.forEach(v => v.start = true)
    const players = [...data.start, ...data.reserve]
    const lBody: any = players.map(v => ({ name: v.playerName, start: v.start }))
    lBody.unshift({ name: teamName, teamName: true })

    return (
        <div className="match-player-data">
            <List rBody={players} lBody={lBody} title={title} color={teamColor}></List>
        </div>
    );
};

export default PlayerData



