import styles from "./AvatarCluster.module.css";

interface AvatarClusterProps {
  avatars: string[];
}

export function AvatarCluster({ avatars }: AvatarClusterProps) {
  return (
    <div className={styles.cluster} aria-hidden="true">
      {avatars.map((avatar, index) => (
        <img
          key={`${avatar}-${index}`}
          className={styles.avatar}
          src={avatar}
          alt=""
        />
      ))}
    </div>
  );
}
