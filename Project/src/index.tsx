import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import ForceGraph3D from 'react-force-graph-3d';

interface NodeObject {
  id: number;
}

interface LinkObject {
  source: NodeObject;
  target: NodeObject;
}

interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

const App: React.FC = () => {
  const [data, setData] = useState<GraphData>({ nodes: [{ id: 0 }], links: [] });

  const handleClick = useCallback((node: NodeObject) => {
    const { nodes, links } = data;

    // Remove node on click
    const newLinks = links.filter(l => l.source.id !== node.id && l.target.id !== node.id); // Remove links attached to node
    const newNodes = nodes.slice();
    newNodes.splice(node.id, 1); // Remove node
    newNodes.forEach((n, idx) => { n.id = idx; }); // Reset node ids to array index

    setData({ nodes: newNodes, links: newLinks });
  }, [data, setData]);

  const handleBackgroundClick = useCallback((event: MouseEvent): void =>
  {
    // Add a new connected node every background click
    setData(({ nodes, links }) => {
      const id = nodes.length;
      const newNode = { id } as NodeObject;
      const targetNode = nodes[Math.floor(Math.random() * nodes.length)];
      return {
        nodes: [...nodes, newNode],
        links: [...links, { source: newNode, target: targetNode }]
      };
    });
  }, []);

  return (
    <ForceGraph3D
      linkLabel={(link) => `${(link.source as NodeObject).id} -> ${(link.target as NodeObject).id}`}
      nodeLabel={(node) => `Node ${node.id}`}
      enableNodeDrag={false}
      onNodeClick={handleClick}
      onBackgroundClick={handleBackgroundClick}
      graphData={data}
    />
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
