/**
 * 赛后贴-球队数据项对比数据
 */

import React from 'react';
import './index.less'


function getPercent(v1, v2, currItem) {
    v1 = Number(v1)
    v2 = Number(v2)

    const item = currItem == 'first' ? v1 : v2
    const percent =  item / (v1 + v2) * 100 + '%';
    // console.log('percent--->', percent)
    return percent;
}

const TeamCompare = (props) => {
    const { first, second, title } = props.data
    console.log('first-->', first, second, title)
    if (!title) return null;
    return (
        <div className="match-team-compare">
            {
                title.map((v, index) => {
                    const v1 = first[v.value]
                    const v2 = second[v.value]
                    return (
                        <div className="team-compare" key={index}>
                            <div className="team-item-data">
                                <span>{v1}</span>
                                <span>{v.name}</span>
                                <span>{v2}</span>
                            </div>
                            <div className="compare-item">
                                <div className="item left">
                                    <span 
                                        className={+v1 > +v2 ? 'red' : 'gray'} 
                                        style={{width: getPercent(v1, v2, 'first')}}></span>
                                </div>
                                <div className="item right">
                                    <span 
                                        className={+v2 > +v1 ? 'blue' : 'gray'} 
                                        style={{ width: getPercent(v1, v2, 'second') }}></span>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default TeamCompare



