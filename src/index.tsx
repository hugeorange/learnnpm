/**
 * 赛后贴
 */

import React, { Fragment } from 'react';

import Video from './comps/video/index'
import PlayerData from './comps/playerData/index'
import TeamData from './comps/teamData/index'
import request from './util/request.js'
import { get } from './util/index'

import './index.less'

const ENV = {
    test: 'https://test.mobileapi.hupu.com',
    pre: 'https://games-pre.mobileapi.hupu.com',
    prod: 'https://games.mobileapi.hupu.com'
}

interface postProps {
    matchId: any,
    useSide: string,
    env: string,
    afterUpdatePage?: Function,
}
export default class MatchPost extends React.Component<postProps, any> {
    matchId: string;
    useSide: string;
    prefixUrl: string;
    constructor(props: any) {
        super(props);
        this.state = {
            videoInfo: {},
            recap: {},

            fPlayers: {},
            sPlayers: {},
            playerTitle: [],
            fDnpPlayers: [],
            sDnpPlayers: [],

            teamData: [], // 分节数据
            teamCompare: {}, // 两队数据项对比

            schema: '',
        }
        this.matchId = props.matchId;
        this.useSide = props.useSide;
        this.prefixUrl = ENV[props.env || 'prod'];
        console.log(this.matchId, this.useSide, this.prefixUrl)
        
    }
    componentDidMount() {
        this.getMatchStats()
    }

    getMatchStats() {
        const url = this.prefixUrl + `/{projectId}/{version}/basketballapi/matchCompletedAutoPostContent?matchId=${this.matchId}${this.props.env == 'test' ? '&realTime=true' : ''}`
        request(url).then(data => {
            console.log('data--->', data)
            this.updatePage(data)
        }).catch(err => {
            alert('接口已废弃')
            console.log('err--->', err)
        })
    }

    updatePage(data) {
        const playerData = get(data, 'result.playerStats', {})
        const playerVertical = get(data, 'result.playerVertical', [])
        const matchStats = get(data, 'result.matchStats', {})
        const teamStats = get(data, 'result.teamStats', {})
        const teamVertical = get(data, 'result.teamVertical', {})
        const schema = get(data, 'result.schema', {})

        // 战报集锦
        const recapVideo = this.initRecapVideo(data)
        // 球员数据
        const playersData = this.initPlayerData(playerData, playerVertical)
        // 球队数据
        const teamData = this.initTeamData(matchStats, teamStats, teamVertical, schema)

        this.setState({
            ...recapVideo,
            ...playersData,
            ...teamData,
        }, () => {
            setTimeout(() => {
                this.props.afterUpdatePage && this.props.afterUpdatePage() 
            }, 300);
        })
    }

    // 初始化战报集锦数据
    initRecapVideo(data) {
        const videoInfo = get(data, 'result.matchVideo', null)
        const recap = get(data, 'result.battleReport', null)
        return {
            videoInfo, 
            recap
        }
    }
    // 初始化双方球队数据
    initTeamData(matchStats, teamStats, teamVertical, schema) {
        const title = teamVertical[0].map((item, index) => {
            return {
                name: teamVertical[1][index],
                value: item
            }
        })

        return {
            teamData: matchStats,
            teamCompare: {
                first: teamStats.leftTeam,
                second: teamStats.rightTeam,
                title
            },
            schema
        }
    }

    // 初始化双方球员数据
    initPlayerData(data, vertical) {
        const fPlayers = data.first || {};
        const sPlayers = data.second || {};
        const fDnpPlayers = get(data, 'first.dnpPlayerList', [])
        const sDnpPlayers = get(data, 'second.dnpPlayerList', [])
        const titles = vertical[0].map((v, i) => ({ name: vertical[1][i], value: vertical[0][i] }))

        return {
            fPlayers,
            sPlayers,
            playerTitle: titles,
            fDnpPlayers,
            sDnpPlayers,
        }
    }

    render() {
        const { 
            videoInfo, 
            recap,
            
            fPlayers,
            sPlayers,
            playerTitle,

            fDnpPlayers,
            sDnpPlayers,

            teamData,
            teamCompare,
            schema
        } = this.state
        return (
            <div className="match-post">
                {/* 集锦 */}
                {videoInfo && videoInfo.title && <Video info={videoInfo}/>} 

                {/* 球员数据 */}
                <div className="post-player">
                    <div className="post-title mlr-15">
                        球员数据
                        <span className="tips">可横滑查看更多数据</span>
                    </div>
                    <PlayerData data={fPlayers} title={playerTitle}/>
                    <div className="not-play mlr-15">
                        {
                            !!fDnpPlayers.length &&
                            <Fragment>
                                <span>未出场队员：</span>
                                {fDnpPlayers.join('、')}
                            </Fragment>
                        }
                    </div>
                    <PlayerData data={sPlayers} title={playerTitle}/>
                    <div className="not-play mlr-15">
                        {
                            !!sDnpPlayers.length &&
                            <Fragment>
                                <span>未出场队员：</span>
                                {fDnpPlayers.join('、')}
                            </Fragment>
                        }
                    </div>
                </div>
                {/* 球队数据 */}
                <div className="post-team">
                    <div className="post-title mlr-15">
                        球队数据
                        <span className="tips">可横滑查看更多数据</span>
                    </div>
                    <TeamData teamCompare={teamCompare} teamData={teamData} />
                    <a href={this.useSide == 'app' ? schema : 'https://mobile.hupu.com'}>
                        <div className="see-more">进入直播间查看更多数据，视频</div>
                    </a>
                </div>

                {/* 战报 */}
                {recap && recap.recap &&
                    <div className="post-recap">
                        <div className="post-title">战报</div>
                        <div className="rich-text">
                            <div className="recap-title">{recap.title}</div>
                            <div dangerouslySetInnerHTML={{ __html: recap.recap}}></div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
