import React, { useState, useEffect } from 'react';
import { StoryNode, Choice, Consequence } from '@/lib/game/types';
import { Id } from '@/convex/_generated/dataModel';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    const consequence = updatedConsequences[consIndex] as Consequence;

    if (field === 'type') {
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

  if (!node) return <div className="text-muted-foreground">No node selected</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Story Node</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1" htmlFor="content">
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              rows={4}
              className="w-full"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Choices</h3>
            {choices.map((choice, index) => (
              <Card key={choice.id} className="mb-4">
                <CardContent className="space-y-2">
                  <Input
                    value={choice.text}
                    onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
                    placeholder="Choice text"
                    className="mb-2"
                  />
                  <Input
                    value={choice.nextNodeId}
                    onChange={(e) => handleChoiceChange(index, 'nextNodeId', e.target.value)}
                    placeholder="Next node ID"
                    className="mb-2"
                  />
                  <h4 className="text-md font-semibold mb-2">Consequences</h4>
                  {choice.consequences.map((cons, consIndex) => (
                    <div key={consIndex} className="space-y-2">
                      <Select
                        onValueChange={(value) => handleConsequenceChange(index, consIndex, 'type', value)}
                        defaultValue={cons.type}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select consequence type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="addItem">Add Item</SelectItem>
                          <SelectItem value="removeItem">Remove Item</SelectItem>
                          <SelectItem value="setFlag">Set Flag</SelectItem>
                          <SelectItem value="alterStat">Alter Stat</SelectItem>
                          <SelectItem value="changePoliticalValue">Change Political Value</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={cons.target}
                        onChange={(e) => handleConsequenceChange(index, consIndex, 'target', e.target.value)}
                        placeholder="Target"
                        className="mb-2"
                      />
                      {(cons.type === 'setFlag' || cons.type === 'alterStat' || cons.type === 'changePoliticalValue') && (
                        <Input
                          value={'value' in cons ? cons.value.toString() : ''}
                          onChange={(e) => handleConsequenceChange(index, consIndex, 'value', e.target.value)}
                          placeholder="Value"
                          type={cons.type === 'setFlag' ? 'checkbox' : 'number'}
                          className="mb-2"
                        />
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handleAddConsequence(index)}
                    className="mt-2"
                  >
                    Add Consequence
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button
              variant="outline"
              onClick={handleAddChoice}
              className="mt-4"
            >
              Add Choice
            </Button>
          </div>
          <Button
            onClick={handleSave}
            className="mt-4"
          >
            Save Node
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryNodeEditor;