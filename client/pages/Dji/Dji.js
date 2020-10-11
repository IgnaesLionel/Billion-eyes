import React, { useEffect, useState } from 'react';
import { Spinner } from '../../components';
import styles from './Dji.module.min.css';
import data from "../../../dji.json";
import wave from './../../../assets/wave.svg';
import {gsap, TimelineMax} from "gsap";

export default function Dji() {
  const [isFetching, setIsFetching] = useState(true);
  const [users, setUsers] = useState(null);
  const header= React.createRef();


  useEffect(() => {
    fetch('/api/users')
      .then(result => delay(result.json()))
      .then(users => {
        setIsFetching(false);
        setUsers(users);
      })
      .catch(error => {
        setIsFetching(false);
        console.log(error);
      })
      gsap.to(header.current, {x: 50, color: "#8c0", duration: 2});
    }, [header]);

  return (
    <>
    <div className="accueil">
      <h1 ref={header}> Dow Jones CFD </h1>
      <table>
        <div>
        <tr><td> djiDPP = {data.djiDPP}</td></tr>
        <tr><td>djiDR1 = {data.djiDR1}</td></tr>
        <tr><td>djiDS1 = {data.djiDS1}</td></tr>
        <tr><td>djiDR2 = {data.djiDR2}</td></tr>
        <tr><td>djiDS2 = {data.djiDS2}</td></tr>
        <tr><td>djiDR3 = {data.djiDR3}</td></tr>
        <tr><td>djiDS3 = {data.djiDS3}</td></tr>
        </div>
        <div>
        <tr><td>djiWPP = {data.djiWPP}</td></tr>
        <tr><td>djiWR1 = {data.djiWR1}</td></tr>
        <tr><td>djiWS1 = {data.djiWS1}</td></tr>
        <tr><td>djiWR2 = {data.djiWR2}</td></tr>
        <tr><td>djiWS2 = {data.djiWS2}</td></tr>
        <tr><td>djiWR3 = {data.djiWR3}</td></tr>
        <tr><td>djiWS3 = {data.djiWS3}</td></tr>
        </div>
        <div>
        <tr><td>djiMPP = {data.djiMPP}</td></tr>
        <tr><td>djiMR1 = {data.djiMR1}</td></tr>
        <tr><td>djiMS1 = {data.djiMS1}</td></tr>
        <tr><td>djiMR2 = {data.djiMR2}</td></tr>
        <tr><td>djiMS2 = {data.djiMS2}</td></tr>
        <tr><td>djiMR3 = {data.djiMR3}</td></tr>
        <tr><td>djiMS3 = {data.djiMS3}</td></tr>
        </div>
        <div>
        <tr><td>xS1 = {data.xS1}</td></tr>
        <tr><td>xS2 = {data.xS2}</td></tr>
        <tr><td>xS3 = {data.xS3}</td></tr>
        <tr><td>xR1 = {data.xR1}</td></tr>
        <tr><td>xR2 = {data.xR2}</td></tr>
        <tr><td>xR3 = {data.xR3}</td></tr>
        </div>
      </table>

  </div>
    </>
  );
}

console.log(data)
      //<img src={wave} className="fond-curvy"/>
