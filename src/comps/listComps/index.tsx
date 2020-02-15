import React, {Component} from 'react'
import './index.less'


class TableScrollFixed extends Component<any, any> {
    static defaultProps = {
        headerStrList: [],
        statsRowList: [],
        leftCol: 1,
        divW: {}
    }
    constructor(props) {
        super(props)
    }

    render() {
        const { title, rBody, lBody, color } = this.props;
        return (
            <div className="table-wrap-views">
                <div className="table-views table-views-body">
                    <div className="table-body-left">
                        <table cellSpacing="0" cellPadding="0">
                            <tbody>
                                {
                                    lBody.map((tr, trIndex) => (
                                        <tr key={trIndex}>
                                            <td>
                                                <div 
                                                    className={`body-cell cell ${tr.teamName ? 'team' : ''} ${tr.start ? 'start' : ''}`}
                                                    style={{ borderColor: color}}
                                                >
                                                    {tr.name}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="table-body-right" >
                        <table cellSpacing="0" cellPadding="0">
                            <tbody>
                                <tr>
                                    {title.map((tr, index) => (
                                        <td key={index}>
                                            <div className="body-cell cell">{tr.name}</div>
                                        </td>
                                    ))}
                                </tr>
                                {
                                    rBody.map((tr, trIndex) => (
                                        <tr key={trIndex}>
                                            {title.map((td, tdIndex) => {
                                                return (
                                                    <td key={tdIndex}>
                                                        <div className="body-cell cell">{tr[td.value]}</div>
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default TableScrollFixed