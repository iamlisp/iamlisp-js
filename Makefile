build-image:
	docker build -t pldin601/iamlisp-server .

push-image:
	docker push pldin601/iamlisp-server
