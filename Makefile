all:
	@docker-compose -f docker-compose.yml up --build -d

clean:
	@docker-compose -f docker-compose.yml down

fclean: clean
	@docker system prune -a -f