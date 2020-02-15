/**
 * 赛后贴-球员数据
 */

import React, { Fragment } from 'react';
import List from '../listComps/index'
import TeamCompare from '../teamCompare/index'
import './index.less'


const getTableData = (teamData) => {
    const firstName = teamData.firstTeam.teamName;
    const secondName = teamData.secondTeam.teamName;
    const firstSection = teamData.firstTeam.section;
    const secondSection = teamData.secondTeam.section;
    const fTotal = teamData.firstTeam.totalScore;
    const sTotal = teamData.secondTeam.totalScore;

    const lBody = [
        { name: '球队' },
        { name: firstName },
        { name: secondName }
    ];
    const title = firstSection.map((v, i) => {
        return {
            name: i > 3 ? '加' + (i - 3) : i + 1,
            value: i
        }
    });
    title.unshift({ name: '总分', value: 'totalScore' })

    const fTeam = {}
    const sTeam = {}
    title.forEach((v, i) => fTeam[v.value] = typeof v.value == 'number' ? firstSection[i-1] : fTotal)
    title.forEach((v, i) => sTeam[v.value] = typeof v.value == 'number' ? secondSection[i-1] : sTotal)
    const rBody = [fTeam, sTeam]
    return {
        title,
        lBody,
        rBody,
    }
}

const TeamData = (props) => {
    const { teamData, teamCompare } = props;
    if (!teamData.firstTeam) return null;
    const firstName = teamData.firstTeam.teamName;
    const secondName = teamData.secondTeam.teamName;
    const firstColor = teamData.secondTeam.teamColor;
    const secondColor = teamData.secondTeam.teamColor;

    // 两队比赛数据==> 表格组装
    const { title, lBody, rBody } = getTableData(teamData)
    return (
        <div className="match-team-data">
            <List rBody={rBody} lBody={lBody} title={title} />
            {
                teamCompare.first && teamCompare.second &&
                <Fragment>
                    <div className="team-name">
                        <span style={{ backgroundColor: firstColor }}>{firstName}</span>
                        <span style={{ backgroundColor: secondColor }}>{secondName}</span>
                    </div>
                    <TeamCompare data={teamCompare} />
                </Fragment>
            }
        </div>
    );
};

export default TeamData



