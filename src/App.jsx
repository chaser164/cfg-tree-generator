import './css/App.css'
import CFGTree from './components/CFGTree'
import GrammarGen from './components/GrammarGen'
import { useState } from 'react';

function App() {
  const [grammar, setGrammar] = useState([]);

  return (
    <>
    <div>
      <div className='header-section'>
        <h1>Context-Free Grammar Tree Generator</h1>
        <h4>Built by Chase Reynders</h4>
      </div>
      <div className='left-align'>
        <h3>Usage</h3>
        <ol className='left-align'>
          <li>Specify a grammar by choosing an example or adding your own rules with the &quot;Add Rule&quot; button.</li>
          <li>Select a root node with the drop down menu.</li>
          <li>Build a random tree with the &quot;Build Random Tree From Grammar&quot; button.</li>
          <li>Explore the result by scrolling and dragging within the tree window or reading the generated output beneath.</li>
        </ol>
      </div>
      <div className='cfg-tree-container'>
        <div>
          <GrammarGen grammar={grammar} setGrammar={setGrammar} />
        </div>
        <div>
          <CFGTree grammar={grammar} />
        </div>
      </div>
      <div className='github-link'>
        <a href="https://github.com/chaser164/cfg-tree-generator">Contribute to this project on GitHub!</a>
      </div>
    </div>
    </>
  )
}

export default App
