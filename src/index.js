const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push( repository );
  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = checkRepositoryExistenceAndReturnPosition( id, response );

  const updatedRepository = checkEmptyRequestData( title, techs,  url );
  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = repository;

  return response.json(repository);


      function checkEmptyRequestData( title, techs, url ) {
        const updatedRepository = {};

        if (title) {
          updatedRepository.title = title;
        }

        if (techs && techs.length > 0) {
          updatedRepository.techs = techs;
        }

        if (url) {
          updatedRepository.url = url;
        }
        return updatedRepository;
      }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = checkRepositoryExistenceAndReturnPosition( id, response );
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = checkRepositoryExistenceAndReturnPosition( id, response );

  repositories[repositoryIndex].likes++;
  return response.json( repositories[repositoryIndex] );
});


const checkRepositoryExistenceAndReturnPosition = ( id, response ) => {
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  return repositoryIndex;
}

module.exports = app;
