import '../css/CFGTree.css';
import Tree from 'react-d3-tree';
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';

const CFGTree = ({ grammar }) => {
  const [orgChart, setOrgChart] = useState({});
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [selectedRoot, setSelectedRoot] = useState('');
  const [sentenceState, setSentenceState] = useState('');
  const treeContainerRef = useRef(null);

  useEffect(() => {
    if (treeContainerRef.current) {
      const dimensions = treeContainerRef.current.getBoundingClientRect();
      setTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 4
      });
    }
  }, []);

  useEffect(() => {
    // Update selected root if its no longer present
    const grammarEntry = grammar.find(entry => entry.key === selectedRoot);
      if (!grammarEntry) {
        setSelectedRoot('');
      }

  }, [grammar, selectedRoot]);

  const setOrgChartHandler = () => {
    if (grammar.length === 0) {
      alert("Please specify grammar rules before building a tree.");
      return;
    }

    if (!selectedRoot) {
      alert("Please select a root node from the drop down menu.");
      return;
    }

    setSentenceState('');

    const generateChart = (key, sentence = '') => {
      const node = { name: key, children: [] };
      const grammarEntry = grammar.find(entry => entry.key === key);
      if (!grammarEntry) {
        setSentenceState(prevState => prevState + key + ' ');
        return node;
      }
      
      const distributions = grammarEntry.distributions;
      const randomDistributionIndex = Math.floor(Math.random() * distributions.length);
      const selectedDistribution = distributions[randomDistributionIndex];

      for (const item of selectedDistribution) {
        const childNode = generateChart(item, sentence); // Fetching first element of distribution
        node.children.push(childNode);
      }
      return node;
    };
    try {
      const newChart = generateChart(selectedRoot);
      setOrgChart(newChart);
  } catch (error) {
      if (error instanceof RangeError) {
          setSentenceState('');
          alert('Call stack capacity exceeded! Ensure your CFG does not cause infinitely recursive behavior.')
      } else {
          throw error; // Rethrow the error if it's not a RangeError
      }
  }
  };

  return (
    <div className='tree-container'>
      <h2>Tree Output</h2>
      <div className="drop-down">
        <label htmlFor="rootSelect">Select Root Node: </label>
        <select id="rootSelect" value={selectedRoot} onChange={(e) => setSelectedRoot(e.target.value)}>
          <option value="">Select Root</option>
          {grammar.map(entry => (
            <option key={entry.key} value={entry.key}>{entry.key}</option>
          ))}
        </select>
      </div>
      <button className='build-button' onClick={setOrgChartHandler}>Build Random Tree From Grammar</button>
      <div id="treeWrapper" ref={treeContainerRef}>
        <Tree 
          data={orgChart} 
          translate={translate} 
          // scaleExtent={{min: 0.1, max: 0.8}}
          orientation={'vertical'}
          pathFunc="straight"
          collapsible={false}
        />
      </div>
      <p className="sentence-output">{sentenceState}</p>
    </div>
  );
};

CFGTree.propTypes = {
  grammar: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      distributions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired
    })
  ).isRequired
};

export default CFGTree;
