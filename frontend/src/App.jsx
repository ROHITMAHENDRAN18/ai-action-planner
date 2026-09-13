import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float,
  MeshDistortMaterial,
  Sphere,
  Stars,
  Sparkles as ThreeSparkles
} from '@react-three/drei';

import { motion, AnimatePresence } from 'framer-motion';

import {
  Bot,
  Sparkles,
  CheckCircle2,
  Loader2,
  Rocket,
  Clock3,
  BrainCircuit,
  ShieldCheck
} from 'lucide-react';

import './App.css';


// ==========================================
// 3D REALISTIC INTERACTIVE ORB
// ==========================================

function RealisticOrb() {
  const sphereRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (sphereRef.current) {
      sphereRef.current.rotation.x = time * 0.15;
      sphereRef.current.rotation.y = time * 0.25;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={1.2}
      floatIntensity={1.5}
    >
      <Sphere
        ref={sphereRef}
        args={[1, 128, 128]}
        scale={2.2}
      >
        <MeshDistortMaterial
          color="#8b5cf6"
          attach="material"
          distort={0.4}
          speed={2.5}
          roughness={0.15}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>
    </Float>
  );
}


// ==========================================
// MAIN APP
// ==========================================

export default function App() {

  // ------------------------------------------
  // USER GOAL
  // ------------------------------------------

  const [goal, setGoal] = useState(
    'Prepare for DBMS exam in 5 days'
  );


  // ------------------------------------------
  // AI GENERATED TASKS
  // ------------------------------------------

  const [tasks, setTasks] = useState([]);


  // ------------------------------------------
  // TIME BUDGET
  // ------------------------------------------

  const [timeBudget, setTimeBudget] = useState(null);


  // ------------------------------------------
  // LOADING STATE
  // ------------------------------------------

  const [loading, setLoading] = useState(false);


  // ------------------------------------------
  // ERROR STATE
  // ------------------------------------------

  const [error, setError] = useState('');


  // ==========================================
  // GENERATE AI PLAN
  // ==========================================

  const handleGenerate = async (e) => {

    e.preventDefault();

    if (!goal.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    setTasks([]);
    setTimeBudget(null);

    try {

      // --------------------------------------
      // CALL DEPLOYED FASTAPI BACKEND
      // --------------------------------------

      const response = await fetch(
        'https://ai-action-planner.onrender.com/api/plan',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            goal: goal.trim()
          })
        }
      );


      // --------------------------------------
      // CHECK SERVER RESPONSE
      // --------------------------------------

      if (!response.ok) {

        throw new Error(
          `Server error: ${response.status}`
        );

      }


      // --------------------------------------
      // CONVERT RESPONSE TO JSON
      // --------------------------------------

      const data = await response.json();

      console.log('AI Response:', data);


      // --------------------------------------
      // VALIDATE BACKEND RESPONSE
      // --------------------------------------

      if (
        data.plan &&
        Array.isArray(data.plan.tasks)
      ) {

        setTasks(data.plan.tasks);

        // Get time budget calculated
        // by the backend planning tool
        setTimeBudget(
          data.plan.time_budget || null
        );

      } else {

        throw new Error(
          'Invalid response received from AI backend.'
        );

      }

    } catch (err) {

      console.error('API Error:', err);

      setError(
        'Unable to connect to the AI planner. Please try again.'
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // PRIORITY CLASS
  // ==========================================

  const getPriorityClass = (priority) => {

    switch (priority?.toUpperCase()) {

      case 'HIGH':
        return 'priority-high';

      case 'MEDIUM':
        return 'priority-medium';

      case 'LOW':
        return 'priority-low';

      default:
        return 'priority-medium';

    }
  };


  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {

    switch (status?.toUpperCase()) {

      case 'REALISTIC':
        return 'status-realistic';

      case 'MODERATE':
        return 'status-moderate';

      case 'HEAVY':
        return 'status-heavy';

      default:
        return 'status-moderate';

    }
  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="app-container">


      {/* ======================================
          THREE.JS BACKGROUND
      ====================================== */}

      <div className="canvas-container">

        <Canvas
          camera={{
            position: [0, 0, 5.5],
            fov: 60
          }}
        >

          <ambientLight intensity={0.5} />

          <directionalLight
            position={[10, 10, 10]}
            intensity={2}
            color="#ffffff"
          />

          <pointLight
            position={[-10, -10, -5]}
            color="#06b6d4"
            intensity={3}
          />

          <pointLight
            position={[10, -10, 5]}
            color="#a855f7"
            intensity={2}
          />

          <Stars
            radius={100}
            depth={50}
            count={4000}
            factor={4}
            saturation={0}
            fade
            speed={1.2}
          />

          <ThreeSparkles
            count={80}
            scale={10}
            size={3}
            speed={0.4}
            color="#a855f7"
          />

          <RealisticOrb />

        </Canvas>

      </div>


      {/* ======================================
          MAIN GLASS CARD
      ====================================== */}

      <motion.div
        className="main-card-wrapper"

        initial={{
          opacity: 0,
          y: 30,
          scale: 0.95
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }}

        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }}
      >

        <div className="glass-card">


          {/* ==================================
              HEADER
          ================================== */}

          <div className="card-header">

            <div className="badge">

              <Bot size={15} />

              <span>
                AI Core v2.4
              </span>

            </div>


            <h1 className="card-title">
              AI Action Planner
            </h1>


            <p className="card-subtitle">
              Transform complex goals into structured,
              executable roadmaps.
            </p>


            {/* AGENT STATUS */}

            <div className="agent-status">

              <span className="status-dot"></span>

              <span>
                Autonomous Planning Agent Online
              </span>

            </div>

          </div>


          {/* ==================================
              GOAL FORM
          ================================== */}

          <form onSubmit={handleGenerate}>

            <div className="input-group">

              <label className="input-label">
                Enter your goal
              </label>


              <div className="input-wrapper">

                <Sparkles
                  className="input-icon"
                  size={20}
                />


                <input
                  type="text"
                  className="action-input"

                  placeholder="e.g., Prepare for DBMS exam in 5 days"

                  value={goal}

                  onChange={(e) =>
                    setGoal(e.target.value)
                  }

                  disabled={loading}
                />

              </div>

            </div>


            {/* ==================================
                GENERATE BUTTON
            ================================== */}

            <button
              type="submit"
              className="btn-submit"
              disabled={loading || !goal.trim()}
            >

              {loading ? (

                <>

                  <Loader2
                    className="spinner"
                    size={20}
                  />

                  <span>
                    AI is creating your plan...
                  </span>

                </>

              ) : (

                <>

                  <span>
                    Generate Strategy
                  </span>

                  <Rocket size={18} />

                </>

              )}

            </button>

          </form>


          {/* ==================================
              ERROR MESSAGE
          ================================== */}

          <AnimatePresence>

            {error && (

              <motion.div
                className="error-message"

                initial={{
                  opacity: 0,
                  y: 10
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                exit={{
                  opacity: 0
                }}
              >

                {error}

              </motion.div>

            )}

          </AnimatePresence>


          {/* ==================================
              AI GENERATED PLAN
          ================================== */}

          <AnimatePresence>

            {tasks.length > 0 && (

              <motion.div
                className="plan-container"

                initial={{
                  opacity: 0,
                  y: 20
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                exit={{
                  opacity: 0,
                  y: -10
                }}

                transition={{
                  duration: 0.5
                }}
              >


                {/* ==================================
                    PLAN TITLE
                ================================== */}

                <div className="plan-title">

                  <CheckCircle2 size={20} />

                  <span>
                    AI Generated Action Plan
                  </span>

                </div>


                {/* ==================================
                    AGENT EXPLANATION
                ================================== */}

                <div className="agent-info">

                  <BrainCircuit size={18} />

                  <div>

                    <strong>
                      Planning Agent evaluated your goal
                    </strong>

                    <span>
                      The generated tasks were checked using
                      the Time Budget Tool.
                    </span>

                  </div>

                </div>


                {/* ==================================
                    TIME BUDGET
                ================================== */}

                {timeBudget && (

                  <motion.div
                    className="time-budget-card"

                    initial={{
                      opacity: 0,
                      scale: 0.97
                    }}

                    animate={{
                      opacity: 1,
                      scale: 1
                    }}

                    transition={{
                      duration: 0.4
                    }}
                  >

                    <div className="budget-item">

                      <div className="budget-icon">

                        <Clock3 size={20} />

                      </div>

                      <div>

                        <span className="budget-label">
                          Total Time
                        </span>

                        <strong>
                          {timeBudget.total_hours} hours
                        </strong>

                      </div>

                    </div>


                    <div className="budget-divider"></div>


                    <div className="budget-item">

                      <div className="budget-icon">

                        <ShieldCheck size={20} />

                      </div>

                      <div>

                        <span className="budget-label">
                          Plan Status
                        </span>

                        <strong
                          className={
                            getStatusClass(
                              timeBudget.status
                            )
                          }
                        >
                          {timeBudget.status}
                        </strong>

                      </div>

                    </div>

                  </motion.div>

                )}


                {/* ==================================
                    TASK LIST
                ================================== */}

                <div className="plan-list">

                  {tasks.map((task, index) => (

                    <motion.div
                      className="plan-item"
                      key={index}

                      initial={{
                        opacity: 0,
                        x: -10
                      }}

                      animate={{
                        opacity: 1,
                        x: 0
                      }}

                      transition={{
                        delay: index * 0.1
                      }}
                    >


                      {/* NUMBER */}

                      <span className="step-num">
                        {index + 1}
                      </span>


                      {/* TASK INFORMATION */}

                      <div className="task-content">

                        <strong className="task-title">
                          {task.title}
                        </strong>


                        <div className="task-details">

                          <span
                            className={`priority-badge ${getPriorityClass(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>

                          <span className="hours-badge">
                            {task.hours} hours
                          </span>

                        </div>

                      </div>

                    </motion.div>

                  ))}

                </div>


                {/* ==================================
                    AGENT COMPLETE MESSAGE
                ================================== */}

                <div className="agent-complete">

                  <CheckCircle2 size={17} />

                  <span>
                    Strategy generated and evaluated successfully
                  </span>

                </div>


              </motion.div>

            )}

          </AnimatePresence>


        </div>

      </motion.div>

    </div>

  );
}