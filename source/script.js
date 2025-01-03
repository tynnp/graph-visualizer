import { runDFS } from './algorithm/dfs.js';
import { runBFS } from './algorithm/bfs.js';
import {runTPLT} from './algorithm/tplt.js';
let adjacencyList = {};  

export function createGraph(N, edges) {
    if (!N || !edges) {
        N = 22;  
        
        edges = [
            { source: 1, target: 2 },
            { source: 2, target: 3 },
            { source: 2, target: 6 },
            { source: 3, target: 5 },
            { source: 4, target: 8 },
            { source: 4, target: 11 },
            { source: 6, target: 7 },
            { source: 7, target: 12 },
            { source: 8, target: 9 },
            { source: 10, target: 14 },
            { source: 12, target: 19 },
            { source: 13, target: 14 },
            { source: 14, target: 15 },
            { source: 15, target: 16 },
            { source: 15, target: 17 },
            { source: 17, target: 18 },
            { source: 18, target: 20 },
            { source: 20, target: 21 },
            { source: 20, target: 22 },
        ];
    }

    const nodes = [];
    const graphContainer = document.getElementById("graph-container");
    const width = graphContainer.clientWidth;
    const height = 400;

    adjacencyList = {};

    for (let i = 1; i <= N; i++) {
        nodes.push({ id: i });
        adjacencyList[i] = [];
    }

    edges.forEach(edge => {
        adjacencyList[edge.source].push(edge.target);
        adjacencyList[edge.target].push(edge.source);
    });

    graphContainer.innerHTML = '';

    const svg = d3
        .select("#graph-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const simulation = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink(edges).id(d => d.id).distance(115))
        .force("charge", d3.forceManyBody().strength(-140))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(50)); 

    const link = svg
        .append("g")
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr("stroke", "#000");

    const node = svg
        .append("g")
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("id", d => `node-${d.id}`)
        .call(
            d3.drag()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = event.x;
                    d.fy = event.y;
                })

                .on("drag", (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })

                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                })
        );

    node
        .append("circle")
        .attr("r", 22)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .style("cursor", "pointer") 
        .on("mouseenter", function(event, d) {
            d3.select(this)  
                .transition()
                .duration(200)
                .attr("fill", "#ebebeb"); 
        })

        .on("mouseleave", function(event, d) {
            d3.select(this) 
                .transition()
                .duration(200)
                .attr("fill", "white"); 
        });

    node
        .append("text")
        .text(d => d.id)
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "black");

    link
        .attr("stroke", "#000")
        .attr("stroke-width", 2);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("transform", d => {
            d.x = Math.max(30, Math.min(width - 30, d.x));
            d.y = Math.max(30, Math.min(height - 30, d.y));
            return `translate(${d.x},${d.y})`;
        });
    });

    return adjacencyList;
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Load lại trang!");
    adjacencyList = createGraph();  
});
// Xử lý không cho thay đổi thuật toán khi đang chạy
function toggleRadioButtons(enabled) {
    radioButtons.forEach(radio => {
        radio.disabled = !enabled;
    });
}

document.getElementById("run-btn").addEventListener("click", async () => {
    if (!selectedAlgorithm) {
        Swal.fire({
            icon: 'warning',
            title: 'Chưa chọn thuật toán',
            text: 'Vui lòng chọn một thuật toán trước khi chạy!',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
        });
        return;
    }
    
    toggleRadioButtons(false); 

    console.log("Đã RUN!");
    if (selectedAlgorithm === "value-1") {
        await runDFS(adjacencyList);
        console.log("Chạy xong DFS!");
        toggleRadioButtons(true); 
    } else if (selectedAlgorithm === "value-2") { // BFS
        await runBFS(adjacencyList);
        console.log("Chạy xong BFS!");
        toggleRadioButtons(true); 
    } else if (selectedAlgorithm === "value-3") { // TPLT
         await runTPLT(adjacencyList);
         console.log("Chạy xong TPLT!");
        toggleRadioButtons(true); 
    }
});

document.getElementById("create-graph-btn").addEventListener("click", () => {
    document.getElementById("create-graph-modal").style.display = "block";
});

document.getElementById("close-modal-btn").addEventListener("click", () => {
    document.getElementById("create-graph-modal").style.display = "none";
});

document.getElementById("submit-graph-btn").addEventListener("click", () => {
    const nodesEdgesInput = document.getElementById("nodes-edges").value;
    const edgesInput = document.getElementById("edges").value;

    const [N, M] = nodesEdgesInput.split(' ').map(Number);
    const edges = edgesInput.split('\n').map(edge => {
        const [source, target] = edge.split(' ').map(Number);
        return { source, target };
    });

    adjacencyList = createGraph(N, edges);
    console.log("Đã tạo đồ thị mới!");
    
    document.getElementById("create-graph-modal").style.display = "none";
});

let selectedAlgorithm = null; // Biến lưu thuật toán đã chọn

const radioButtons = document.querySelectorAll('.radio-input input');
const algorithmChoice = document.getElementById('algorithm-choice');
const stackSection = document.getElementById('stack');
const queueSection = document.getElementById('queue');
const tpltSection = document.getElementById('tplt');

radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        const selectedValue = document.querySelector('.radio-input input:checked').value;

        // Cập nhật thuật toán đã chọn
        selectedAlgorithm = selectedValue;

        algorithmChoice.style.display = 'none';
        stackSection.style.display = 'none';
        queueSection.style.display = 'none';
        tpltSection.style.display = 'none';

        // Hiển thị phần tương ứng
        if (selectedValue === "value-1") {  // DFS
            stackSection.style.display = 'block';
        } else if (selectedValue === "value-2") {  // BFS
            queueSection.style.display = 'block';
        } else if (selectedValue === "value-3") {  // TPLT
            tpltSection.style.display = 'block';
        }
    });
});
// Xử lý hiển thị hướng dẫn
document.addEventListener('DOMContentLoaded', () => {
    const instructionBtn = document.getElementById('show-instruction-btn');
    const instructionModal = document.getElementById('instruction-modal');
    const closeInstruction = document.querySelector('.close-instruction');
    
    document.getElementById('instruction-modal').style.display = 'none';
    instructionBtn.addEventListener('click', () => {
        instructionModal.style.display = 'block';
    });

    closeInstruction.addEventListener('click', () => {
        document.getElementById('instruction-modal').style.display = 'none';
    });
    // Đóng modal khi nhấn vào nút đóng
    document.querySelector('.close-instruction').addEventListener('click', function() {
        document.querySelector('.instruction-modal').style.display = 'none';
    });
    // Đóng modal khi click ngoài
    window.addEventListener('click', (event) => {
        if (event.target === instructionModal) {
            instructionModal.style.display = 'none';
        }
    });
});
// Xử lý hiển thị modal hướng dẫn
document.addEventListener('DOMContentLoaded', () => {
    const instructionBtn = document.getElementById('show-create-graph-instruction-btn'); // Nút hiển thị hướng dẫn
    const instructionModal = document.querySelector('.graph-instruction-modal'); // Modal hướng dẫn
    const closeInstructionBtn = document.querySelector('.grap-close-instruction'); // Nút đóng modal

    // Đảm bảo modal không hiển thị khi tải trang
    instructionModal.style.display = 'none';

    // Mở modal khi nhấn nút hiển thị hướng dẫn
    instructionBtn.addEventListener('click', () => {
        instructionModal.style.display = 'flex'; // Sử dụng flex để căn giữa
    });

    // Đóng modal khi nhấn vào nút đóng
    closeInstructionBtn.addEventListener('click', () => {
        instructionModal.style.display = 'none'; // Ẩn modal
    });

    // Đóng modal khi nhấn ra ngoài modal
    window.addEventListener('click', (event) => {
        if (event.target === instructionModal) {
            instructionModal.style.display = 'none'; // Ẩn modal
        }
    });
});
let speed = 1; 

document.addEventListener('DOMContentLoaded', () => {
    const decreaseSpeedButton = document.getElementById('decrease-speed');
    const increaseSpeedButton = document.getElementById('increase-speed');
    const currentSpeedElement = document.getElementById('current-speed');

    function getCurrentSpeed() {
        const speedText = currentSpeedElement.textContent; 
        console.log("Current Speed Text: ", speedText); 
        return parseFloat(speedText.replace('x', '')); 
    }

    function setCurrentSpeed(newSpeed) {
        currentSpeedElement.textContent = `${newSpeed}x`;
    }

    setCurrentSpeed(speed); 

    decreaseSpeedButton.addEventListener('click', () => {
        if (speed > 0.5) {
            speed -= 0.5; 
            setCurrentSpeed(speed); 
        }
    });

    increaseSpeedButton.addEventListener('click', () => {
        speed += 0.5; 
        setCurrentSpeed(speed); 
    });
});

export { speed };
