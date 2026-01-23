import React, {useState} from 'react';
import './Lobby.css';
import {ReactComponent as LogoutIcon} from './imgs/exit-icon.svg';
import {ReactComponent as BackIcon} from './imgs/back-icon.svg';
import Robot from './imgs/profile_pics/robot.svg';
import Cat from './imgs/profile_pics/cat.svg';
import Astronaut from './imgs/profile_pics/astronaut.svg';
import Ninja from './imgs/profile_pics/ninja.svg';
import Bunny from './imgs/profile_pics/bunny.svg';
import Coolcap from './imgs/profile_pics/coolcap.svg';
import Gamer from './imgs/profile_pics/gamer.svg';

const avatars = [Robot, Cat, Astronaut, Ninja, Bunny, Coolcap, Gamer];

function Lobby()
{
    const [profile_pic] = useState(() => {
        
        const saved = localStorage.getItem('profile_pic_index');
        if (saved != null) {return avatars[Number(saved)]};

        const idx = Math.floor(Math.random() * avatars.length);
        localStorage.setItem('profile_pic_index', String(idx));
        return avatars[idx];
    });    

    const [showRules,setShowRules] = useState(false);

    const [maxCapacity,setMaxCapacity] = useState(2);
    
    const [view,setView] = useState('home');

    const [playersJoined,setPlayersJoined] = useState(1);

    const [roomCode,setRoomCode] = useState('X2GADTT');

    const [canStart,setCanStart] = useState(false);

    return (
        <div className = 'lobby'>
        
            <div className = 'lobby-top'>

                <div className = 'lobby-top-left'>
                    <img src = {profile_pic} alt = 'profile_pic' className = 'profile-pic' />
                    <h2 className = 'welcome-text'> Harsh </h2>
                </div>
                
                <div className = 'lobby-top-right'>
                    <a className = 'how-to-play' onClick = {() => setShowRules(true)}> How to Play </a>
                    <button className = 'logout-btn'> Logout <LogoutIcon className = 'logout-icon' /> </button>
                </div>

            </div>

            <div className = 'lobby-center'>

                {view == 'home' && 
                <>
                    <div className = 'lobby-navigator'>

                        <button className = 'create-room-btn' onClick = {() => setView('create')}> <span className = 'create-room-text'> CREATE A ROOM </span> </button>
                        <span className = 'or-separator'> OR </span>
                        <button className = 'join-room-btn' onClick = {() => setView('join')}> <span className = 'join-room-text'> JOIN A ROOM </span> </button>

                    </div>
                </>}

                {view == 'create' && 
                <>
                    <div className = 'create-room'>

                        <div className = 'room-capacity'>
                            <h2> Select the max number of players </h2>

                            <div className = 'counter'>
                                <button className = 'decrement' onClick = {() => setMaxCapacity(n => Math.max(2,n - 1))}> - </button>
                                <input type = 'text' className = 'number' value = {maxCapacity} readOnly/>
                                <button className = 'increment' onClick = {() => setMaxCapacity(n => Math.max(2,n + 1))}> + </button>
                            </div>
                            
                        </div>

                        <div className = 'room-navigator'>

                            <button className = 'back-btn' onClick = {() => setView('home')}> Go Back </button>
                            <button className = 'finalize-create-room-btn' onClick = {() => setView('waiting')}> CREATE ROOM </button>
                        </div>


                    </div>
                </>}




                {view == 'join' &&
                <>
                    <div className = 'join-room'>

                        <div className = 'room-link'>
                            <input type = 'text' placeholder = 'ENTER ROOM CODE TO JOIN' className = 'input-room' />
                            <button className = 'finalize-join-room-btn'> JOIN ROOM </button>
                        </div>

                        <div className = 'join-room-back'>
                            <button className = 'back-btn' onClick = {() => setView('home')}> Go Back </button>
                        </div>

                    </div>

                </>}


                {view == 'waiting' && 
                <>

                    <div className = 'waiting-room'>

                        <div className = 'joined-count'>

                            <h3 className = 'joined-heading'> Players Joined : <span> {playersJoined} / {maxCapacity} </span></h3>

                        </div>

                        <div className = 'joined-box'>

                            <div className = 'player-row'>

                                <img src = {profile_pic} alt = 'profile_pic' className = 'profile-pic' />
                                <span className = 'host-text'> Harsh (Host) </span>

                            </div>

                            <p className = 'waitingText'> Waiting for players  
                                <span className = 'dots a'>.</span>
                                <span className = 'dots'>.</span>
                                <span className = 'dots'>.</span>
                             </p>

                        </div>

                        <div className = 'code-box'>

                            <div className = 'code-left'>
                                <span className = 'code-text'> Room Code </span>
                                <span className = 'room-code'> {roomCode} </span>
                            </div>

                            <button className = 'copy-code-btn'> Copy Code ! </button>

                        </div>

                        <button className = 'start-game-btn' disabled = {!canStart}> Start Game </button>

                        <button className = 'backToLobbyBtn' onClick = {() => setView('create')}> Back to Lobby <BackIcon className = 'back-icon' /> </button>

                    </div>


                </>}


            </div>

            
                







           {showRules && (
            <div className = 'modalOverlay' onClick = {() => setShowRules(false)}>

                <div className = 'modalCard' onClick = {(e) => e.stopPropagation()}>
                    <div className = 'modalHeader'>
                        <h2 className = 'modalTitle'> How to Play UNO </h2>
                        <button className = 'modalCloseBtn' onClick = {() => setShowRules(false)}> X </button>
                    </div>

                    <div className = 'modalBody'>
                        <h3>Goal</h3>
                        <p>
                            Be the first player to get rid of all your cards. Score points from cards left in
                            the opponent’s hand (optional scoring).
                        </p>

                        <h3>Setup</h3>
                        <ul>
                            <li>Each player is dealt <b>7 cards</b>.</li>
                            <li>Place the remaining cards face-down as the <b>Draw Pile</b>.</li>
                            <li>Flip the top card to start the <b>Discard Pile</b>.</li>
                        </ul>

                        <h3>Taking a Turn</h3>
                        <ul>
                            <li>You must play a card that matches the top of the discard pile by <b>color</b> or <b>number/symbol</b>.</li>
                            <li>If you can’t play, draw <b>1</b> card. If it’s playable, you may play it immediately (common rule); otherwise your turn ends.</li>
                            <li>Action/Wild cards apply their effects when played.</li>
                        </ul>

                        <h3>Action Cards</h3>
                        <ul>
                            <li><b>Skip</b>: next player loses their turn.</li>
                            <li><b>Reverse</b>: reverses play direction. (With 2 players, it effectively acts like a Skip: the same player goes again.)</li>
                            <li><b>Draw Two (+2)</b>: next player draws 2 cards and loses their turn.</li>
                        </ul>

                        <h3>Wild Cards</h3>
                        <ul>
                            <li><b>Wild</b>: choose the next color to play.</li>
                            <li><b>Wild Draw Four (+4)</b>: choose the next color; next player draws 4 and loses their turn.</li>
                        </ul>

                        <h3>Calling “UNO!”</h3>
                        <ul>
                            <li>When you play down to <b>1 card</b>, you must say <b>UNO</b>.</li>
                            <li>If you forget and the opponent catches you before the next turn begins, you draw a penalty (commonly <b>2 cards</b>).</li>
                        </ul>

                        <h3>Winning</h3>
                        <ul>
                            <li>You win the round when you play your last card.</li>
                            <li>Optional: continue playing rounds until a player reaches a target score (often <b>500</b>).</li>
                        </ul>

                        <h3>Scoring (Optional)</h3>
                        <ul>
                            <li>Number cards: face value (0–9)</li>
                            <li>Skip / Reverse / Draw Two: 20 points each</li>
                            <li>Wild / Wild Draw Four: 50 points each</li>
                        </ul>

                        <h3>Notes (Common Variations)</h3>
                        <ul>
                            <li>Whether you can play the drawn card immediately can vary by house rules.</li>
                            <li>Wild Draw Four legality challenges exist in official rules; you can skip this in your game for simplicity.</li>
                        </ul>
                    </div>

                    <div className = 'modalFooter'>

                        <button className = 'modalOk' type = 'button' onClick = {() => setShowRules(false)}> Got it ! </button>
                    </div>

                </div>
            </div>
           )}

        </div>      
    )
}

export default Lobby;