/**
 * 赛后贴-视频集锦
 */

import React from 'react';
import './index.less'


const VideoCollect = (props) => {
    const info = props.info;
    return (
        <div className="match-post-video">
            <div className="post-title">视频集锦</div>
            <a href={info.videoUrl} className="video-wrap">
                <img src={info.cover} alt="" />
                <div className="video-tips">
                    <span>集锦 : {info.title}</span>
                </div>
                <i></i>
            </a>
        </div>
    );
};

export default VideoCollect



