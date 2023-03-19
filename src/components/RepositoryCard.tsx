const RepositoryCard = ({ repository }) => {
  const {
    name,
    stargazers_count,
    pushed_at,
    owner,
    languages,
    description,
  } = repository;

  return (
    <div className="repository-card">
      <h2 className="repository-name">
        {name} - {stargazers_count} stars - {new Date(pushed_at).toLocaleDateString()}
      </h2>
      <div className="repository-owner">
        {owner.avatar_url && (
          <img src={owner.avatar_url} alt={owner.login} className="owner-avatar" />
        )}
        <a href={owner.html_url} target="_blank" rel="noreferrer" className="owner-nickname">
          {owner.login}
        </a>
      </div>
      <ul className="repository-languages">
        {Object.keys(languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <p className="repository-description">{description}</p>
    </div>
  );
};

export default RepositoryCard;

