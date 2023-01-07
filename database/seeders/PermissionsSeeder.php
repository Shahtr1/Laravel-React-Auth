<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $arrayOfPermissionNames = [
            // Users
            "read users",
            "create users",
            "update users",
            "delete users",
        ];

        $permissions = collect($arrayOfPermissionNames)->map(function ($permission) {
            return ["name" => $permission, "guard_name" => "web"];
        });

        Permission::insert($permissions->toArray());

        Role::create(["name"=>"superAdmin"])->givePermissionTo(Permission::all());
        Role::create(["name"=>"admin"])->givePermissionTo(['read users','update users']);
        Role::create(["name"=>"user"])->givePermissionTo(['read users']);

        User::find(1)->assignRole('superAdmin');
        User::find(2)->assignRole('admin');
        User::find(3)->assignRole('user');

    }
}
