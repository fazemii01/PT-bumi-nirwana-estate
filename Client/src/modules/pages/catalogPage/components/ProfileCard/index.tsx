import React, { FC } from 'react';
import styles from './ProfileCard.module.scss';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { IoChevronDown } from "react-icons/io5";
import type { IAgent, IDeveloper } from '@t-types/data';

interface IProfileCardProps extends IAgent, IDeveloper {}

const ProfileCard: FC<IProfileCardProps> = ({
  id,
  full_name,
  phone_number: phoneNumber,
  email,
  website,
  avatar_url,
  name,
  website_url,
  logo_url,
}) => {
  
  return (
    <div className={styles.profileCard}>
         <h3>{'Developer'}</h3>
         <br />
      <div className={styles.cardHeader}>
        <div className={styles.userInfo}>
          {logo_url ? (
            <img
              src={logo_url}
              alt={`${name || 'Agent'}'s profile picture`}
              width={56}
              height={56}
              className={styles.profilePicture}
            />
          ) : (
            <div className={styles.defaultImage} />
          )}

          <div className={styles.userDetails}>
            <h2>{name}</h2>
            <p>{website_url}</p>
                       
          </div>
        </div>
      </div>
      <h3>{'Agen'}</h3>
      <br />
      <div className={styles.cardHeader}>
        <div className={styles.userInfo}>
          {avatar_url ? (
            <img
              src={avatar_url}
              alt={`${full_name || 'Agent'}'s profile picture`}
              width={56}
              height={56}
              className={styles.profilePicture}
            />
          ) : (
            <div className={styles.defaultImage} />
          )}

          <div className={styles.userDetails}>
            <h2>{full_name}</h2>
            <p>{email}</p>
            <p>{website}</p>
            
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={`${styles.button} ${styles.phoneButton}`}>
          <span className={styles.buttonLeft}>
            <FaPhoneAlt />
            <span>{phoneNumber}</span>
          </span>
        </button>

        <button className={`${styles.button} ${styles.whatsappButton}`}
        onClick={() => window.open(`https://wa.me/${phoneNumber}`, '_blank')}
        >
          <FaWhatsapp />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
