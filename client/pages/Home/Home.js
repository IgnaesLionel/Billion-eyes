import React, { useEffect, useState } from 'react';
import { Spinner } from '../../components';
import styles from './Home.module.scss';
import {gsap, TimelineMax} from "gsap";


export default function Home() {
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
      });
      gsap.to(header.current, {x: 50, color: "#8c0", duration: 2});
  }, []);

  return (
    <>
      <div className="accueil">
        <h1 ref={header}> Billion-eyes </h1>
        <p>    Bienvenue sur Billion-eyes !
        <span className={styles.greetUser}>{users && users[0].name}</span>
        </p>
      </div>
    </>
  );
}
