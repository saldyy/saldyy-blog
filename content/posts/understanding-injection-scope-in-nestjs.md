+++
date = '2024-11-03T15:30:06+07:00'
draft = false
title = 'Understanding Injection Scope in Nestjs'
+++

If you're a NodeJS developer, you must have heard about [NestJS](https://nestjs.com/). It's a progressive Node.js framework built for creating efficient, reliable, and scalable server-side applications. One of the core feature is **Dependency Injection**.

When using **Dependency Injection**, a provider in NestJS can be one of these threes scopes:
1. **Default Scope**
Perhaps, this is the most common use case of the **Dependency Injection** in NestJS. By default, each provider will have only one instance and it will be passed accross the whole application. It's similar to Singleton Pattern.

```javascript
@Injectable({ scope: Scope.DEFAULT })
export class DefaultScopeService {
  private count: number;

  constructor() {
    this.count = 0;
  }

  getCounter() {
    return { count: this.count++ };
  }
}
```

The example above is declaring a simple service with a **getCounter** method. And we will inject it into the controller like this:

```javascript
@Controller('default-scope')
export class DefaultScopeController {
  constructor(private readonly defaultScopeService: DefaultScopeService) {}

  @Get('/count')
  getCount() {
    return this.defaultScopeService.getCounter();
  }
}
```

The result when we calling this api is quite obvious. Since we declare the **count** as a
private property of the service, therefore each api call will return the current value of **count** and then increase it by one.

![default-scope-example](/images/article-005/default-scope.png)

2. **Request Scope**

In this scope, a new provider instance is created for each incoming request. We will tweak a little the example of **Default Scope** to see how it behaves.


```javascript
@Controller('request-scope')
export class RequestScopeController {
  constructor(private readonly requestScopeService: RequestScopeService) {}

  @Get('/count')
  getCount() {
    return this.requestScopeService.getCounter();
  }
}

@Injectable({ scope: Scope.REQUEST })
export class RequestScopeService {
  private count: number;

  constructor() {
    this.count = 0;
  }

  getCounter() {
    return { count: this.count++ };
  }
}
```
As you can see, the code is almost exactly the same. The only different is that we change the
**scope** in **Injectable** decorator. Now, let's test it:

![request-scope-example](/images/article-005/request-scope.png)

The result is vastly different from **Default Scope**. For every single API call, it always return 0 because of the initiate **RequestScopeService** for each request. You can imagine that we will create **new RequestScopeService()** whenever a new request received. And we set the **count** property to 0 in the constructor, therefore the result will be 0.

3. **Transient Scope**

As the doccument stated: *Transient providers are not shared across consumers. Each consumer that injects a transient provider will receive a new, dedicated instance*. Let's take alook of these code to understand how it works.
```javascript
@Injectable({ scope: Scope.TRANSIENT })
export class TransientScopeService {
  private count: number;

  constructor() {
    this.count = 0;
  }

  getCounter() {
    return { count: this.count++ };
  }
}

@Controller('transient-scope')
export class TransientScopeController {
  constructor(private readonly transientScopeService: TransientScopeService) {}

  @Get('/count')
  getCount() {
    return this.transientScopeService.getCounter();
  }
}

@Controller({ path: 'transient-scope', version: '2' })
export class TransientScopeV2Controller {
  constructor(private readonly transientScopeService: TransientScopeService) {}

  @Get('/count')
  getCount() {
    return this.transientScopeService.getCounter();
  }
}
```

We only need to change the scope to **Transient** and keep the same logic as above examples. But, in the controller, instead of one, we will inject it into two controllers. When we run the apis, here is the result:

![transient-scope-example](/images/article-005/transient-scope.png)

When we call the **v2** api, the response is the same as **Default Scope**, count is increased by one after each api call. However, switching to the original api, it resets the count.
When we use Transient Scope, whenever we inject the provider to a consumer. NestJS will create a new instance of the provider. In this case, it will initiate **new TransientScopeService()** and set the count to 0.

Those are the concept and how to use each type of the **Injection Scope** in NestJS. But you might wonder what if we want to combine those scope with each other. In that case, we need to be aware of the [Scope hierarchy](https://docs.nestjs.com/fundamentals/injection-scopes#scope-hierarchy)
Let's create a controller using all three scopes:

```javascript
@Controller('combined')
export class CombinedScopeController {
  constructor(
    private readonly defaultScopeService: DefaultScopeService,
    private readonly requestScopeService: RequestScopeService,
    private readonly transientScopeService: TransientScopeService,
  ) {}

  @Get('/count')
  getCount() {
    return {
      defaultCount: this.defaultScopeService.getCounter(),
      requestCount: this.requestScopeService.getCounter(),
      transientCount: this.transientScopeService.getCounter(),
    };
  }
}
```

Now's let test this api:

![combined-scope-example](/images/article-005/combined-scope.png)

Hmmm, it's stranged. The **Default Scope** is still working as expected but the **Transient Scope** is behaved weirdly, to be exact, it's giving the same result as **Request Scope**. How can that be possible?

Turns out, when we use **Request Scope**, it will bubble up the injection chain. In other words, all of the consumer injecting a **Request Scope** provider will also becomes **Request Scope**. In this example, the **CombinedScopeController** is also affected by it. But that doesn't really explain why the **Transient Scope** working improperly. Remember how **Transient** works? It injects a new in instance to a new consumer. In this case, since the controller is a request scope, it will be terminated after each request successfully handled and a new instance will be created for each new incoming request. Each newly spawn instance will be also treated as a new consumer.

<p align="center">
  <img src="/gifs/mind-blow.gif#center" alt="mind-blow" />
</p>


That's one of the weird behavior of NestJS for **Dependency Injection** which can lead to some magic bug. Let's take a note on this feature and use the **Injection Scope** with caution.

All of my example code can be found in this [repository](https://github.com/saldyy/nestjs-injection-scope).
