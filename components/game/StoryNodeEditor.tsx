import React, { useState, useEffect } from 'react';
import { StoryNode, Choice, Consequence } from '@/lib/game/types';
import { Id } from '@/convex/_generated/dataModel';

interface StoryNodeEditorProps {
  node: StoryNode | null;
  onNodeUpdate: (updatedNode: StoryNode) => void;
}

const StoryNodeEditor: React.FC<StoryNodeEditorProps> = ({ node, onNodeUpdate }) => {
  const [content, setContent] = useState('');
  const [choices, setChoices] = useState<Choice[]>([]);

  useEffect(() => {
    if (node) {
      setContent(node.content);
      setChoices(node.choices);
    }
  }, [node]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleChoiceChange = (index: number, field: keyof Choice, value: string) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = { ...updatedChoices[index], [field]: value };
    setChoices(updatedChoices);
  };

  const handleConsequenceChange = (choiceIndex: number, consIndex: number, field: 'type' | 'target' | 'value', value: string) => {
    const updatedChoices = [...choices];
    const updatedConsequences = [...updatedChoices[choiceIndex].consequences];
    const consequence = updatedConsequences[consIndex];

    if (field === 'type') {
      // Reset the consequence when changing type
      if (value === 'addItem' || value === 'removeItem') {
        updatedConsequences[consIndex] = { type: value, target: '' };
      } else if (value === 'setFlag') {
        updatedConsequences[consIndex] = { type: value, target: '', value: false };
      } else if (value === 'alterStat' || value === 'changePoliticalValue') {
        updatedConsequences[consIndex] = { type: value, target: '', value: 0 };
      }
    } else if (field === 'target') {
      updatedConsequences[consIndex] = { ...consequence, target: value };
    } else if (field === 'value') {
      if (consequence.type === 'setFlag') {
        updatedConsequences[consIndex] = { ...consequence, value: value === 'true' };
      } else if (consequence.type === 'alterStat' || consequence.type === 'changePoliticalValue') {
        updatedConsequences[consIndex] = { ...consequence, value: Number(value) };
      }
    }

    updatedChoices[choiceIndex] = { ...updatedChoices[choiceIndex], consequences: updatedConsequences };
    setChoices(updatedChoices);
  };

  const handleAddChoice = () => {
    setChoices([...choices, { id: Date.now().toString(), text: '', consequences: [], nextNodeId: '' as Id<"storyNodes"> }]);
  };

  const handleAddConsequence = (choiceIndex: number) => {
    const updatedChoices = [...choices];
    updatedChoices[choiceIndex].consequences.push({ type: 'addItem', target: '' });
    setChoices(updatedChoices);
  };

  const handleSave = () => {
    if (node) {
      onNodeUpdate({ ...node, content, choices });
    }
  };

  if (!node) return <div>No node selected</div>;

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Edit Story Node</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
          Content
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="content"
          value={content}
          onChange={handleContentChange}
          rows={4}
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Choices</h3>
        {choices.map((choice, index) => (
          <div key={choice.id} className="mb-4 p-4 border rounded">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
              value={choice.text}
              onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
              placeholder="Choice text"
            />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
              value={choice.nextNodeId}
              onChange={(e) => handleChoiceChange(index, 'nextNodeId', e.target.value)}
              placeholder="Next node ID"
            />
            <h4 className="text-md font-bold mb-2">Consequences</h4>
            {choice.consequences.map((cons, consIndex) => (
              <div key={consIndex} className="mb-2">
                <select
                  className="shadow border rounded py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
                  value={cons.type}
                  onChange={(e) => handleConsequenceChange(index, consIndex, 'type', e.target.value)}
                >
                  <option value="addItem">Add Item</option>
                  <option value="removeItem">Remove Item</option>
                  <option value="setFlag">Set Flag</option>
                  <option value="alterStat">Alter Stat</option>
                  <option value="changePoliticalValue">Change Political Value</option>
                </select>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
                  value={cons.target}
                  onChange={(e) => handleConsequenceChange(index, consIndex, 'target', e.target.value)}
                  placeholder="Target"
                />
                {(cons.type === 'setFlag' || cons.type === 'alterStat' || cons.type === 'changePoliticalValue') && (
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
                    value={'value' in cons ? cons.value.toString() : ''}
                    onChange={(e) => handleConsequenceChange(index, consIndex, 'value', e.target.value)}
                    placeholder="Value"
                    type={cons.type === 'setFlag' ? 'checkbox' : 'number'}
                  />
                )}
              </div>
            ))}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => handleAddConsequence(index)}
            >
              Add Consequence
            </button>
          </div>
        ))}
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleAddChoice}
        >
          Add Choice
        </button>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleSave}
      >
        Save Node
      </button>
    </div>
  );
};

export default StoryNodeEditor;