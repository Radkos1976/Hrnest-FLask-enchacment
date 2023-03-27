"""empty message

Revision ID: 7a9057454acb
Revises: 809eaf7687fb
Create Date: 2021-10-17 14:05:57.079852

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7a9057454acb'
down_revision = '809eaf7687fb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user_request', sa.Column('emp_id', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user_request', 'emp_id')
    # ### end Alembic commands ###
