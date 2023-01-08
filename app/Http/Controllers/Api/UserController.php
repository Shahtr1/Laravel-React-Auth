<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class UserController extends Controller
{
    private string $unauthorizedText = "Unauthorized, you dont have access";

    public function showLoggedInUser(){
        return new UserResource(auth()->user());
    }

    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection|Response
     */
    public function index()
    {
        if(auth()->user()->cannot('read users')){
            return \response($this->unauthorizedText,403);
        }
        return UserResource::collection(
            User::query()->orderBy('id','desc')->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreUserRequest $request
     * @return Response
     */
    public function store(StoreUserRequest $request)
    {
        if(auth()->user()->cannot('create users')){
            return \response($this->unauthorizedText,403);
        }
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);
        return \response(new UserResource($user),201);
    }

    /**
     * Display the specified resource.
     *
     * @param User $user
     * @return UserResource|Response
     */
    public function show(User $user)
    {
        if(auth()->user()->cannot('read users')){
            return \response($this->unauthorizedText,403);
        }
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateUserRequest $request
     * @param User $user
     * @return UserResource|Response
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        if(auth()->user()->cannot('update users')){
            return \response($this->unauthorizedText,403);
        }
        $data = $request->validated();
        if(isset($data['password'])){
            $data['password'] = bcrypt($data['password']);
        }
        $user->update($data);

        return new UserResource($user);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return Response
     */
    public function destroy(User $user)
    {
        if(auth()->user()->cannot('delete users')){
            return \response($this->unauthorizedText,403);
        }
        $user->delete();

        return response("",204);
    }
}
