import { useState } from 'react';
import '../css/GrammarGen.css';
import PropTypes from 'prop-types';

const grammar1 = [
    {"key":"S","distributions":[["NP","VP"]]},
    {"key":"PP","distributions":[["P","NP"]]},
    {"key":"VP","distributions":[["V","NP"],["VP","PP"]]},
    {"key":"P","distributions":[["with"]]},
    {"key":"V","distributions":[["saw"]]},
    {"key":"NP","distributions":[["NP","PP"],["astronomers"],["ears"],["eyes"],["stars"],["telescopes"]]}
]

const grammar2 = [
  {"key":"S","distributions":[["NP","VP"]]},
  {"key":"NP","distributions":[["Det","N"],["PN"]]},
  {"key":"Det","distributions":[["a"],["the"]]},
  {"key":"N","distributions":[["mouse"],["cat"],["dog"]]},
  {"key":"PN","distributions":[["it"]]},
  {"key":"VP","distributions":[["VI"],["VT","NP"],["V3","that","S"]]},
  {"key":"VI","distributions":[["slept"],["swam"]]},
  {"key":"VT","distributions":[["chased"],["evaded"]]},
  {"key":"V3","distributions":[["dreamed"],["believed"]]}
]

const grammar3 = [
    {"key":"S","distributions":[["NP","VP"]]},
    {"key":"NP","distributions":[["Det","N"],["NP","PP"]]},
    {"key":"VP","distributions":[["VP","PP"],["V","NP"],["V","PP"]]},
    {"key":"PP","distributions":[["P","NP"]]},
    {"key":"N","distributions":[["student"],["professor"],["eggplant"],["knife"],["tree"]]},
    {"key":"V","distributions":[["ate"],["followed"],["cut"],["drew"]]},
    {"key":"Det","distributions":[["the"],["a"],["every"],["some"]]},
    {"key":"P","distributions":[["with"],["without"]]}
]

const GrammarGen = ({ grammar, setGrammar }) => {
  const [newKey, setNewKey] = useState('');
  const [values, setValues] = useState(['']);
  const [addingRule, setAddingRule] = useState(false);

  const handleAddSample = (gram) => {
    // Deep copy each list of distributions
    const copiedGram = gram.map(rule => ({
        ...rule,
        distributions: rule.distributions.map(dist => [...dist])
    }));

    if (grammar.length !== 0) {
        // Ensure user wants to overwrite grammar
        const result = window.confirm("Are you sure you want to overwrite the existing grammar rules?");
        if (result) {
            setGrammar(copiedGram);
            return;
        }
    }
    else {
        setGrammar(copiedGram);
    }
}

  const handleAddRule = () => {
    setAddingRule(true);
  };

  const handleCancel = () => {

    setNewKey('');
    setValues(['']);
    setAddingRule(false);
  };

  const handleConfirm = () => {
    const trimmedKey = newKey.trim(); // Remove spaces from newKey
    const trimmedValues = values.map(val => val.trim()); // Remove spaces from each value

    if (trimmedKey && trimmedValues.some(val => val)) {
      setGrammar(prevGrammar => {
        const existingKeyIndex = prevGrammar.findIndex(item => item.key === trimmedKey);
        if (existingKeyIndex !== -1) {
          const newGrammar = [...prevGrammar];
          const newDistribution = trimmedValues.filter(val => val);
          if (!newGrammar[existingKeyIndex].distributions.some(dist => dist.join(',') === newDistribution.join(','))) {
            newGrammar[existingKeyIndex].distributions.push(newDistribution);
          }
          return newGrammar;
        } else {
          return [
            ...prevGrammar,
            {
              key: trimmedKey,
              distributions: [trimmedValues.filter(val => val)]
            }
          ];
        }
      });
    }
    handleCancel();
  };

  const handleAddValue = () => {
    setValues(prevValues => [...prevValues, '']);
  };

  const handleKeyChange = event => {
    setNewKey(event.target.value);
  };

  const handleValueChange = (index, event) => {
    const newValues = [...values];
    newValues[index] = event.target.value;
    setValues(newValues);
  };

  const handleRemoveRule = (index, distIndex) => {
    setGrammar(prevGrammar => {
        const newGrammar = [...prevGrammar];
        const newDist = [...newGrammar[index].distributions];
        newDist.splice(distIndex, 1);
        newGrammar[index].distributions = newDist;
        // Remove entire key if there are no remaining distributions
        if (newDist.length === 0) {
            newGrammar.splice(index, 1);
        }
        return newGrammar;
    });
  };

  return (
    <div className="container">
      <div>
        <h2>Grammar Rules</h2>
        <div className='samples-container'>
            <div className='sample-buttons'>
                <button className='sample-button' onClick={() => handleAddSample(grammar1)}>Example 1</button>
                <button className='sample-button' onClick={() => handleAddSample(grammar2)}>Example 2</button>
                <button className='sample-button' onClick={() => handleAddSample(grammar3)}>Example 3</button>
            </div>
        </div>
        { grammar.length === 0 ? 
            <p className="build-instructions">Select example or add rule to build a grammar!</p>
            :
            <ul className='grammar-list'>
            {grammar.flatMap((rule, ruleIndex) => (
                rule.distributions.map((distribution, index) => (
                <li key={`${rule.key}-${index}`}>
                    <div className='x-button-container'>
                        {rule.key} {"→"} {distribution.join(' ')}
                        <button className='x-button' onClick={() => handleRemoveRule(ruleIndex, index)}> x </button>
                    </div>
                </li>
                ))
            ))}
            </ul>
        }
      </div>
      {!addingRule ? (
        <button onClick={handleAddRule}>Add Rule</button>
      ) : (
        <>
          <div className="rule-input">
            <div className="rule-input-text-holder">
                <p>Enter Key:</p>
                <input
                    type="text"
                    value={newKey}
                    onChange={handleKeyChange}
                    placeholder="Key"
                />
            </div>
            <div className="rule-input-text-holder values-list">
                <p>Enter Value(s):</p>
                    {values.map((value, index) => (
                    <div key={index} className='value-textbox'>
                        <input
                        type="text"
                        value={value}
                        onChange={e => handleValueChange(index, e)}
                        placeholder={`Value ${index + 1}`}
                        />
                    </div>
                    ))}
                    <button
                            className="add-value-button"
                            onClick={handleAddValue}
                            >
                            Add A Value
                    </button>
            </div>


            <div className="conf-or-cancel">
              <button className='conf-or-cancel-button' onClick={handleCancel}>Cancel</button>
              <button className='conf-or-cancel-button' onClick={handleConfirm}>Confirm</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

GrammarGen.propTypes = {
  grammar: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      distributions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired
    })
  ).isRequired,
  setGrammar: PropTypes.func.isRequired
};

export default GrammarGen;
