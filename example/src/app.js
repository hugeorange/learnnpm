import React from 'react'
import ReactDOM from 'react-dom';

import LearnNpm from '../../src/index';

// import LearnNpm from 'learnnpm-o';

const App = () => {
    return (
        <LearnNpm 
            env="test" 
            useSide="app" 
            afterUpdatePage={() => console.log('我已更新完页面')}
            matchId="651023204059447296" />
    )
}
ReactDOM.render(<App />, document.getElementById('root'))
